import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto'; 


@ApiTags('users')
@Controller('users/api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  //  Update user profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Successfully updated profile' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, dto);
  }

  //  Send OTP for password reset
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP for password reset' })
  @ApiResponse({ status: 200, description: 'OTP sent to email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  sendOtp(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.sendOtpForPasswordReset(forgotPasswordDto.email);
  }

  //  Verify OTP
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @ApiResponse({ status: 200, description: 'OTP verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  verifyOtp(@Body() dto: { email: string; otp: string }) {
    return this.userService.verifyOtp(dto.email, dto.otp);
  }

  //  Reset password after OTP verification
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or password' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }
}
