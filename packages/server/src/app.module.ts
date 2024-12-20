import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './_utils/config/env.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ChiselModule } from './chisel/chisel.module';
import { UsersModule } from './users/users.module';
import { SurrealModule } from './surreal/surreal.module';
import { DatabasesModule } from './databases/databases.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { PermissionsModule } from './permissions/permissions.module';
import { MigrationsModule } from './migrations/migrations.module';
import { migrations } from './_utils/db';
import { DynamicQueriesModule } from './dynamic-queries/dynamic-queries.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ChiselModule.forRootAsync({
      uri: './_databases',
      dbName: 'root',
      migrations: migrations,
      generateTypes: true,
      typesDir: './src/_utils/models',
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    BootstrapModule,
    SurrealModule.forRoot({
      path: 'surrealkv://_surrealdb',
      namespace: 'my_namespace',
      database: 'my_database',
      username: 'root',
      password: 'root',
    }),
    DatabasesModule,
    ApiKeysModule,
    PermissionsModule,
    MigrationsModule,
    DynamicQueriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
