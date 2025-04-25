import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dsr } from './dsr.model';
import { DsrService } from './dsr.service';
import { DsrController } from './dsr.controller';

@Module({
  imports: [SequelizeModule.forFeature([Dsr])],
  providers: [DsrService],
  controllers: [DsrController],
})
export class DsrModule {}
