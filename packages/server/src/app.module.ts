import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './_utils/config/env.config';
import { rootSchema } from './_utils/schemas/root.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ChiselModule } from './chisel/chisel.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ChiselModule.forRootAsync({
      uri: './databases',
      dbName: 'root',
      schema: rootSchema,
      generateTypes: true,
      typesDir: './src/models',
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    BootstrapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
