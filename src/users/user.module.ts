import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { RedisModule } from '../redis/redis.module'; 
import { MailerModule } from '../mailer/mailer.module'; 

@Module({
  imports: [
    SequelizeModule.forFeature([User]), 
    RedisModule,
    MailerModule, 
  ],
  providers: [UserService], 
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
