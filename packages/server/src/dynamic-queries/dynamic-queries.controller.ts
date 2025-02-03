import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DynamicQueriesService } from './dynamic-queries.service';
import { Protect } from 'src/auth/_utils/guards/protect.decorator';
import { QueryOptionsDto } from './_utils/dto/request/query-options.dto';
import { Database } from '../_utils/decorators/database.decorator';
import {
  ValidateDatabasePipe,
  ValidateDatabaseTablePipe,
} from '../_utils/pipe/database-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOptionsDto } from './_utils/dto/request/update-options.dto';
import { InsertOptionsDto } from './_utils/dto/request/insert-options.dto';
import { DeleteOptionsDto } from './_utils/dto/request/delete-options.dto';
import { QueryParams } from './_utils/types/params.type';
import { SafeSqlStatement } from './_utils/dto/request/safe-sql-statement.dto';

@ApiTags('Dynamic Queries')
@Controller('dynamic-queries')
export class DynamicQueriesController {
  constructor(private readonly dynamicQueriesService: DynamicQueriesService) {}

  @Protect()
  @Get(':database/:table')
  query(
    @Database(ValidateDatabaseTablePipe)
    params: { dbName: string; tableName: string; clientId: string },
    @Query() queryOptions: QueryOptionsDto,
  ) {
    console.log('In query Dynamic ::::: ', queryOptions);
    return this.dynamicQueriesService.query(params, queryOptions);
  }

  @Protect()
  @Post(':database/query')
  rawSqlQuery(
    @Database(ValidateDatabasePipe)
    params: { dbName: string; clientId: string },
    @Body() rawSqlQuery: SafeSqlStatement,
  ) {
    return this.dynamicQueriesService.executeRawSqlQuery(params, rawSqlQuery);
  }

  @Protect()
  @Post(':database/:table')
  insert(
    @Database(ValidateDatabaseTablePipe)
    params: { dbName: string; tableName: string; clientId: string },
    @Body() insertOptions: InsertOptionsDto,
  ) {
    return this.dynamicQueriesService.insert(params, insertOptions);
  }

  @Protect()
  @Put(':database/:table')
  update(
    @Database(ValidateDatabaseTablePipe)
    params: QueryParams,
    @Body() updateOptions: UpdateOptionsDto,
  ) {
    return this.dynamicQueriesService.update(params, updateOptions);
  }

  @Protect()
  @Delete(':database/:table')
  delete(
    @Database(ValidateDatabaseTablePipe)
    params: { dbName: string; tableName: string; clientId: string },
    @Body() deleteOptions: DeleteOptionsDto,
  ) {
    return this.dynamicQueriesService.delete(params, deleteOptions);
  }
}
