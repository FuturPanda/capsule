import { Injectable, PipeTransform } from '@nestjs/common';
import { ChiselService } from '../../chisel/chisel.service';

@Injectable()
export class ValidateDatabaseTablePipe implements PipeTransform {
  constructor(private readonly chiselService: ChiselService) {}

  async transform(value: {
    clientId: string;
    database: string;
    table: string;
  }) {
    const { clientId, database, table } = value;

    await this.chiselService.validate(clientId, database, table);
    return { dbName: database, tableName: table, clientId: clientId };
  }
}

@Injectable()
export class ValidateDatabasePipe implements PipeTransform {
  constructor(private readonly chiselService: ChiselService) {}

  async transform(value: { clientId: string; database: string }) {
    const { clientId, database } = value;

    await this.chiselService.validateDatabase(clientId, database);
    return { dbName: database, clientId: clientId };
  }
}
