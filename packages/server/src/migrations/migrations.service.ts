import { Injectable } from '@nestjs/common';
import { ChiselService } from '../chisel/chisel.service';
import { DatabasesMapper } from '../databases/databases.mapper';
import { DatabasesService } from '../databases/databases.service';
import {
  CheckMigrationDto,
  Migration,
} from './_utils/dto/request/check-migration.dto';

@Injectable()
export class MigrationsService {
  constructor(
    private readonly chiselService: ChiselService,
    private readonly databasesService: DatabasesService,
    private readonly databaseMapper: DatabasesMapper,
  ) {}

  async runMigrations(apiKey: string, checkMigrationDto: CheckMigrationDto) {
    for (const migration of checkMigrationDto.migrations) {
      this.applyMigrationAndSaveToDb(apiKey, migration);
    }
  }

  private applyMigrationAndSaveToDb(apiKey: string, migration: Migration) {
    const db = this.chiselService.getConnection(apiKey, migration.database);
    const appliedMigrations = db.applyMigrations([migration]);
    if (appliedMigrations > 0) {
      const tables = db.getTables();
      const tableInfos = tables.map((t) =>
        this.databaseMapper.toTableDefinition(t, db.getTableInfo(t)),
      );
      this.databasesService.saveDatabaseInfo(migration.database, apiKey);
      return { dbName: migration.database, tableInfos: tableInfos };
    }
  }
}
