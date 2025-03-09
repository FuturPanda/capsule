import { InsertOptions } from '@capsulesh/shared-types';
import { Injectable } from '@nestjs/common';
import { DatabasesRepository } from 'src/databases/databases.repository';
import { ChiselService } from '../chisel/chisel.service';
import { DeleteOptionsDto } from './_utils/dto/request/delete-options.dto';
import { QueryOptionsDto } from './_utils/dto/request/query-options.dto';
import { SafeSqlStatement } from './_utils/dto/request/safe-sql-statement.dto';
import { UpdateOptionsDto } from './_utils/dto/request/update-options.dto';
import { QueryParams } from './_utils/types/params.type';

@Injectable()
export class DynamicQueriesService {
  constructor(
    private readonly chiselService: ChiselService,
    private readonly databaseRepository: DatabasesRepository,
  ) {}

  async query(database: string, table: string, queryOptions: QueryOptionsDto) {
    const { name, client_id } =
      this.databaseRepository.findDatabaseByName(database);
    const db = this.chiselService.getConnection(client_id, name);

    return db.query(table, queryOptions);
  }

  async insert(
    { clientId, dbName, tableName }: QueryParams,
    insertOptions: InsertOptions,
  ) {
    const db = this.chiselService.getConnection(clientId, dbName);
    return db.insert(tableName, insertOptions);
  }

  async delete(
    { clientId, dbName, tableName }: QueryParams,
    deleteOptions: DeleteOptionsDto,
  ) {
    const db = this.chiselService.getConnection(clientId, dbName);
    return db.delete(tableName, deleteOptions);
  }

  async update(
    { clientId, dbName, tableName }: QueryParams,
    updateOptions: UpdateOptionsDto,
  ) {
    const db = this.chiselService.getConnection(clientId, dbName);
    return db.update(tableName, updateOptions);
  }

  executeRawSqlQuery(
    { dbName, clientId }: { dbName: string; clientId: string },
    { statement }: SafeSqlStatement,
  ) {
    const db = this.chiselService.getConnection(clientId, dbName);
    const res = db.rawQuery(statement);
    return res;
  }
}
