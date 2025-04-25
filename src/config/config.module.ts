import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import redisConfig from '../redis/redis.config';



@Module({
  imports: [NestConfigModule.forRoot({ load: [redisConfig] })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
