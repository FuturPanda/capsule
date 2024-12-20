import { Injectable } from '@nestjs/common';
import { ColInfoType, TableInfoType } from '@capsule/chisel';

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
}
