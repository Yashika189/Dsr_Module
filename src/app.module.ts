import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DsrModule } from './dsr/dsr.module';
import { RedisModule } from './redis/redis.module';
import { WinstonLoggerService } from './logging/winston.logger';
import { LoggingMiddleware } from './logging/logging.middleware';
import { UserService } from './users/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Make sure .env file is available
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: process.env.NODE_ENV === 'development', 
      }),
    }),
    UsersModule,
    AuthModule,
    DsrModule,
    RedisModule,
  ],
  providers: [WinstonLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); 
  }
}
