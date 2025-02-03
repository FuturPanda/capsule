import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChiselDb } from '@capsule/chisel';
import { DEFAULT_DB_PATH } from '../_utils/constants/database.constant';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { DatabaseConnection } from './interface/database-connection.interface';
import { DatabaseDefinition } from './interface/database-definition.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ChiselService {
  private connections: Map<string, DatabaseConnection> = new Map();
  private readonly DEFAULT_MAX_IDLE_TIME = 300000; // 5 minutes
  private readonly CACHE_TTL = 3600000; // 1 hour
  private readonly DB_DEFINITION_CACHE_PREFIX = 'database-definition:';
  private readonly CLIENT_CACHE_PREFIX = 'client:';
  private readonly logger = new Logger(ChiselService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getConnection(clientId: string, dbName: string) {
    const existing = this.connections.get(dbName);

    if (existing) {
      existing.lastAccessed = new Date();
      return existing.connection;
    }

    const connection: DatabaseConnection = {
      dbname: dbName,
      connection: this.createConnection(clientId, dbName),
      lastAccessed: new Date(),
    };

    this.connections.set(dbName, connection);
    return connection.connection;
  }

  closeConnection(dbName: string) {
    const conn = this.connections.get(dbName);
    if (conn) {
      conn.connection.close();
      this.connections.delete(dbName);
    }
  }

  closeAllConnections() {
    for (const [path] of this.connections) {
      this.closeConnection(path);
    }
  }

  async getDefinition(
    clientId: string,
    dbName: string,
  ): Promise<DatabaseDefinition> {
    const cacheKey = this.getDbDefinitionCacheKey(clientId, dbName);

    const cachedSchema =
      await this.cacheManager.get<DatabaseDefinition>(cacheKey);

    if (cachedSchema) {
      this.logger.debug(`Schema cache hit for ${clientId}/${dbName}`);
      return cachedSchema;
    }

    this.logger.debug(`Schema cache miss for ${clientId}/${dbName}`);
    const db = this.getConnection(clientId, dbName);
    const dbDefinition: DatabaseDefinition = {
      dbName: dbName,
      clientId: clientId,
      tables: db.getDbDefinition(),
    };

    await this.cacheManager.set(cacheKey, dbDefinition, this.CACHE_TTL);

    return dbDefinition;
  }

  async validate(clientId: string, dbName: string, tableName: string) {
    const client = true;
    if (!client) {
      throw new UnauthorizedException(`Client unauthorized`);
    }
    const isDatabaseExisting = this.isExisting(clientId, dbName);
    this.logger.debug(
      `DbName : ${dbName} -- clientId : ${clientId} -- tableName : ${tableName} -- isExisting : ${isDatabaseExisting}`,
    );

    if (!isDatabaseExisting) {
      throw new NotFoundException(`Database "${dbName}" does not exist`);
    }

    const definition = await this.getDefinition(clientId, dbName);
    const table = definition.tables.some((t) => t.tableName === tableName);
    if (!table) {
      throw new NotFoundException(
        `Table "${tableName}" does not exist in database "${dbName}"`,
      );
    }
    return true;
  }

  async validateDatabase(clientId: string, dbName: string) {
    const client = true;
    if (!client) {
      throw new UnauthorizedException(`Client unauthorized`);
    }
    const isDatabaseExisting = this.isExisting(clientId, dbName);
    this.logger.debug(
      `DbName : ${dbName} -- clientId : ${clientId}  -- isExisting : ${isDatabaseExisting}`,
    );

    if (!isDatabaseExisting) {
      throw new NotFoundException(`Database "${dbName}" does not exist`);
    }
    return true;
  }

  private createConnection(clientId: string, dbName: string) {
    const dirPath = path.join(DEFAULT_DB_PATH, `${clientId}`);
    const exists = fs.existsSync(dirPath);
    if (!exists) fs.mkdirSync(dirPath, { recursive: true });
    const dbPath = path.join(dirPath, `${dbName}.capsule`);

    return ChiselDb.getConnectionFromPath(dbPath);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  private async cleanupIdleConnections() {
    console.log('In Cron Job');
    const now = new Date();
    for (const [path, conn] of this.connections.entries()) {
      const idleTime = now.getTime() - conn.lastAccessed.getTime();

      if (conn && idleTime > this.DEFAULT_MAX_IDLE_TIME) {
        this.logger.log(`Connection to ${conn.dbname} closed during cron job`);
        this.closeConnection(path);
      }
    }
  }

  private getDbDefinitionCacheKey(clientId: string, dbName: string): string {
    return `${this.DB_DEFINITION_CACHE_PREFIX}${clientId}:${dbName}`;
  }

  private isExisting(clientId: string, dbName: string) {
    const dbPath = path.join(DEFAULT_DB_PATH, clientId, `${dbName}.capsule`);
    return fs.existsSync(dbPath);
  }
}
