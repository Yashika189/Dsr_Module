import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Set up global validation pipe with exception factory to handle validation errors more explicitly
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new Error(`Validation failed: ${errors.map((e) => e.property).join(', ')}`);
      },
    }),
  );

  // Use Winston for logging
  app.useLogger(
    WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    }),
  );

  // Set up Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Daily Status Report API')
    .setDescription('API documentation for DSR and user management.')
    .setVersion('1.0')
    .addBearerAuth() // Ensure that Bearer authentication is set for API calls
    .addTag('DSR', 'Daily Status Report management') // Optional: Group API methods under a tag
    .addTag('User', 'User management') // Optional: Group API methods under a tag
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable cookie parsing for cookies-based sessions
  app.use(cookieParser());

  // Start server
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => {
    Logger.log(`Server running on http://localhost:${port}`);
  });

  // Graceful shutdown to ensure proper cleanup on app termination
  app.enableShutdownHooks();
}

bootstrap();
