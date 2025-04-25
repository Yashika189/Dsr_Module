import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UserService } from './user.service';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  
  @Controller('users/api/v1')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return this.userService.getProfile(req.user.userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
      return this.userService.updateProfile(req.user.userId, dto);
    }
  }
  