import { Controller, Post, Put, Get, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { DsrService } from './dsr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDsrDto } from './dto/create-dsr.dto';
import { UpdateDsrDto } from './dto/update-dsr.dto';

@Controller('users/api/v1/dsr')
@UseGuards(JwtAuthGuard)
export class DsrController {
  constructor(private readonly dsrService: DsrService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateDsrDto) {
    return this.dsrService.create(req.user.userId, dto);
  }

  @Put()
  update(@Request() req, @Body() dto: UpdateDsrDto) {
    return this.dsrService.update(req.user.userId, dto);
  }

  @Get()
  getAll(
    @Request() req,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.dsrService.getAll(req.user.userId, start, end, +page, +limit);
  }

  @Get(':dsrId')
  getById(@Request() req, @Param('dsrId') dsrId: number) {
    return this.dsrService.getById(req.user.userId, dsrId);
  }
}
