import { Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { validateEnv } from './_utils/config/env.config';
import { migrations } from './_utils/db';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ChiselModule } from './chisel/chisel.module';
import { DatabasesModule } from './databases/databases.module';
import { DynamicQueriesModule } from './dynamic-queries/dynamic-queries.module';
import { EventsModule } from './events/events.module';
import { MigrationsModule } from './migrations/migrations.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ReactivityModule } from './reactivity/reactivity.module';
import { SurrealModule } from './surreal/surreal.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { PersonsModule } from './persons/persons.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      global: true,
    }),
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ChiselModule.forRootAsync({
      uri: './_databases/root',
      dbName: 'root',
      migrations: migrations,
      generateTypes: true,
      typesDir: './src/_utils/models',
    }),
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
      isGlobal: true,
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
    EventsModule,
    TasksModule,
    ReactivityModule,
    PersonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
