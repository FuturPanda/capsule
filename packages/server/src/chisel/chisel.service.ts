import { Injectable, Logger } from '@nestjs/common';
import { ChiselDb } from '@capsule/chisel';
import { DEFAULT_DB_PATH } from '../_utils/constants/database.constant';
import { Cron, CronExpression } from '@nestjs/schedule';

interface DatabaseConnection {
  dbname: string;
  connection: ChiselDb;
  lastAccessed: Date;
}

@Injectable()
export class ChiselService {
  private connections: Map<string, DatabaseConnection> = new Map();
  private readonly DEFAULT_MAX_IDLE_TIME = 300000; // 5 minutes
  private readonly logger = new Logger();

  getConnection(dbName: string) {
    const existing = this.connections.get(dbName);

    if (existing) {
      existing.lastAccessed = new Date();
      return existing.connection;
    }

    const connection: DatabaseConnection = {
      dbname: dbName,
      connection: this.createConnection(dbName),
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

  private createConnection(dbName: string) {
    const dbPath = `${DEFAULT_DB_PATH}/${dbName}/${dbName}.capsule`;
    return ChiselDb.getConnectionFromPath(dbPath);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  private async cleanupIdleConnections() {
    const now = new Date();
    for (const [path, conn] of this.connections.entries()) {
      const idleTime = now.getTime() - conn.lastAccessed.getTime();

      if (idleTime > this.DEFAULT_MAX_IDLE_TIME) {
        this.logger.log(`Connection to ${conn.dbname} closed during cron job`);
        this.closeConnection(path);
      }
    }
  }
}
