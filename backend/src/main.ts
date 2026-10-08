import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configLogging } from './shared/configuration/config-logging';
import { configureSwagger } from './shared/configuration/config-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const configService = app.select(SharedModule).get(ApiConfigService);

  // Global routing prefix
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
    }),
  );

  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '10mb' });

  // Swagger and Logging configuration
  configureSwagger(app, configService);
  configLogging(app, configService);

  await app.listen(configService.serverPort);

  const appUrl = await app.getUrl();
  Logger.log(`🚀 Application running on: ${appUrl}`);
  Logger.log(`📚 Swagger documentation: ${appUrl}/swagger`);

  return app;
}

void bootstrap();
