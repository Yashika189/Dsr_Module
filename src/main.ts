import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Use Morgan for HTTP request logging
  app.use(morgan('combined'));

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
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable cookie parsing
  app.use(cookieParser());

  // Start server
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => {
    Logger.log(`Application running on port ${port}`);
  });
}
bootstrap();
