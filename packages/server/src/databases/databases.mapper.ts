import {
  ColInfoType,
  Column,
  MigrationOperation,
  TableInfoType,
} from '@capsulesh/shared-types';
import { Injectable } from '@nestjs/common';
import { CreateDatabaseDto } from './_utils/dto/request/create-database.dto';

@Injectable()
export class DatabasesMapper {
  toTableDefinition = (
    tableName: string,
    tableInfo: Record<any, any>[],
  ): TableInfoType => ({
    tableName: tableName,
    columns: tableInfo.map(
      (info): ColInfoType => ({
        name: info.name,
        type: info.type,
        notNull: !!info.notnull,
        primaryKey: !!info.pk,
      }),
    ),
  });

  toMigrationOperations(
    createDatabaseDto: CreateDatabaseDto,
  ): MigrationOperation[] {
    const operations: MigrationOperation[] = [];

    for (const entity of createDatabaseDto.entities) {
      const operation: MigrationOperation = {
        type: 'createTable',
        tableName: entity.name,
        columns: [],
        primaryKey: entity.compositePrimaryKeys || [],
        uniqueConstraints: entity.uniqueConstraints || [],
        foreignKeys: [],
      };

      for (const [columnName, columnOpts] of Object.entries(entity.columns)) {
        const column: Column = {
          name: columnName,
          type: columnOpts.type,
          autoIncrement: columnOpts.autoIncrement,
          constraints: {
            primaryKey: columnOpts.primaryKey,
            nullable: columnOpts.notNull === false,
            unique: columnOpts.unique,
          },
          defaultValue: columnOpts.defaultValue,
        };

        if (columnOpts.enum) {
          column.enumValues = Object.values(columnOpts.enum);
        }

        operation.columns.push(column);
      }

      if (entity.foreignKeys) {
        for (const [columnName, fkOpts] of Object.entries(entity.foreignKeys)) {
          operation.foreignKeys.push({
            baseColumnName: columnName,
            referencedTableName: fkOpts.foreignTable,
            referencedColumnName: fkOpts.foreignKey,
            constraintName: `fk_${entity.name}_${columnName}`,
          });
        }
      }

      operations.push(operation);
    }

    return operations;
  }
}
