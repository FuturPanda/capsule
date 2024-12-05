import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './_utils/config/env.config';
import { rootSchema } from './_utils/schemas/root.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ChiselModule } from './chisel/chisel.module';
import { UsersModule } from './users/users.module';
import { SurrealModule } from './surreal/surreal.module';
import { DatabasesModule } from './databases/databases.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ChiselModule.forRootAsync({
      uri: './_databases',
      dbName: 'root',
      entities: rootSchema.entities,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
