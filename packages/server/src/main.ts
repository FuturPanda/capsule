import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentVariables } from './_utils/config/env.config';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: 'https://fbed917e42b3f3e7094d483f83a3216c@o4508760491163648.ingest.us.sentry.io/4508760491491328',
  });

  app
    .setGlobalPrefix('api/v1/')
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .enableCors();

  const config = new DocumentBuilder()
    .setTitle('Capsule')
    .setDescription('Capsule')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/doc', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  await app.listen(configService.get('PORT'));
}

bootstrap();
