import { Injectable } from '@nestjs/common';
import { ChiselService } from '../chisel/chisel.service';
import { InsertOptions } from '@capsule/chisel';
import { QueryOptionsDto } from './_utils/dto/request/query-options.dto';
import { DeleteOptionsDto } from './_utils/dto/request/delete-options.dto';
import { UpdateOptionsDto } from './_utils/dto/request/update-options.dto';
import { QueryParams } from './_utils/types/params.type';
import { SafeSqlStatement } from './_utils/dto/request/safe-sql-statement.dto';

@Injectable()
export class DynamicQueriesService {
  constructor(private readonly chiselService: ChiselService) {}

  async query(
    { clientId, dbName, tableName }: QueryParams,
    queryOptions: QueryOptionsDto,
  ) {
    const db = this.chiselService.getConnection(clientId, dbName);
    return db.query(tableName, queryOptions);
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
