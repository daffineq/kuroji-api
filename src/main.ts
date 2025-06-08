import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import Config from './configs/config';
import { Interceptor } from './shared/interceptor';

config();

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    'use strict';
    return () => String(this);
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new Interceptor());
  app.enableCors({
    origin: Config.CORS,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Optionally, transforms payloads to DTOs
      whitelist: true, // Automatically remove properties that do not have decorators
      forbidNonWhitelisted: true, // Throws an error if unknown properties are provided
    }),
  );
  app.use(express.static(join(__dirname, '..', 'public')));
  app.setGlobalPrefix('api');
  await app.listen(Config.PORT);
}
void bootstrap();
