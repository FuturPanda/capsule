import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  PreparedQuery,
  RecordId,
  StringRecordId,
  Surreal,
  surrealql,
  Table,
} from 'surrealdb';
import { SurrealConfig } from './surreal.config';
// @ts-expect-error surrealDbError
import { surrealdbNodeEngines } from '@surrealdb/node';
import { Session } from 'src/_utils/models/root/session';
import { SingleUseToken } from 'src/users/_utils/types/single-use-token';
import { v4 } from 'uuid';
import { ClassType } from '../_utils/_types/generics';
import { CreateSessionDto } from './utils/dto/request/create-session.dto';

@Injectable()
export class SurrealService implements OnModuleInit, OnModuleDestroy {
  private readonly db: Surreal;
  private readonly logger = new Logger(SurrealService.name);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  constructor(@Inject('SURREAL_CONFIG') private config: SurrealConfig) {
    this.db = new Surreal({
      engines: surrealdbNodeEngines(),
    });
  }

  async onModuleInit() {
    try {
      await this.db.connect(this.config.path, {
        namespace: this.config.namespace,
        database: this.config.database,
      });
      this.logger.log('SurrealDB connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to SurrealDB:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.db.close();
  }

  create<T>(table: ClassType<T>, data?: { [P in keyof T]: T[P] }) {
    return this.db.create(table.name, data);
  }

  insert<T extends { [x: string]: any }>(
    table: ClassType<T>,
    data: { [P in keyof T]: T[P] },
  ): Promise<
    {
      [K in keyof (T['id'] extends RecordId<string>
        ? T
        : {
            id: RecordId<string>;
          } & T)]: (T['id'] extends RecordId<string>
        ? T
        : { id: RecordId<string> } & T)[K];
    }[]
  > {
    return this.db.insert<T>(table.name, data);
  }

  select<T>(table: ClassType<T>) {
    return this.db.select(table.name);
  }

  delete(from: Table | RecordId | string) {
    return this.db.delete(from);
  }

  query(query: PreparedQuery) {
    return this.db.query(query);
  }

  async createSession(
    sessionToken: string,
    sessionData: CreateSessionDto,
    ttl: number,
  ): Promise<Session> {
    const query = surrealql`
      CREATE session CONTENT {
        ttl: ${ttl},
        token: ${sessionToken},
        userId: ${sessionData.userId},
        userEmail: ${sessionData.email},
        redirectUri: ${sessionData.redirectUri},
        scopes: ${sessionData.scopes},
        clientIdentifier: ${sessionData.clientIdentifier},
        createdAt: time::now()
      };
    `;

    const result = await this.db.query<[Session]>(query);
    return result[0][0];
  }

  async getSessionById(id: string) {
    try {
      const result = await this.db.select<Session>(new StringRecordId(id));
      return result || null;
    } catch (error) {
      this.logger.error(`Error fetching session with ID ${id}:`, error);
      return null;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      await this.db.delete(`${Session.name}:${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting session with ID ${id}:`, error);
      return false;
    }
  }

  async createSingleUseToken(
    identifier: string,
    sessionId: string,
  ): Promise<SingleUseToken> {
    try {
      const query = surrealql`
      CREATE singleUseToken CONTENT {
      identifier: ${identifier},
      token: ${v4()},
      sessionId: ${sessionId},
      created_at: ${new Date()},
      expires_at: ${new Date(Date.now() + 1 * 60 * 1000)},
      used: ${false},
      }
    `;
      const result = await this.db.query<[SingleUseToken]>(query);
      return result[0][0];
    } catch (error) {
      this.logger.error(`Error creating record`, error);
      throw error;
    }
  }

  async getRecord<T>(
    entityName: string,
    conditionRow: string,
    value: string,
  ): Promise<T | null> {
    try {
      const query = surrealql`
        SELECT * FROM ${entityName} WHERE ${conditionRow} = ${value};
      `;
      const result = await this.db.query(query);
      return (result as T) || null;
    } catch (error) {
      this.logger.error(`Error fetching singleUseToken`, error);
      return null;
    }
  }

  async getSingleUseToken(value: string) {
    try {
      const query = surrealql`
        SELECT * FROM singleUseToken WHERE token = ${value};
      `;
      const result = await this.db.query<[SingleUseToken]>(query);
      return result[0][0] || null;
    } catch (error) {
      this.logger.error(`Error fetching singleUseToken`, error);
      return null;
    }
  }

  async updateSingleUseToken(tokenId: string) {
    try {
      const query = surrealql`
        UPDATE ${tokenId} SET used = true
      `;
      const result = await this.db.query(query);
      console.log('UPDATE RESULT AFTER QUERY ', result);
      return result[0][0];
    } catch (error) {
      this.logger.error(`Error updating singleUseToken`, error);
    }
  }

  async getOpaqueTokenSingleUse(token: string) {
    try {
      const query = surrealql`
        SELECT * FROM tokenSingleUse WHERE token = ${token};
      `;
      const result = await this.db.query(query);
      return result || null;
    } catch (error) {
      this.logger.error(`Error fetching tokenSingleUse`, error);
      return null;
    }
  }

  async deleteTokenSingleUse(token: string): Promise<boolean> {
    try {
      const query = surrealql`
        DELETE tokenSingleUse WHERE token = ${token};
      `;
      await this.db.query(query);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting tokenSingleUse`, error);
      return false;
    }
  }
}
