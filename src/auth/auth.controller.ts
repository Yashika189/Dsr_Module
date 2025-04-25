import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { OtpDto } from './dto/otp.dto';

@Controller('users/api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    // Destructure the dto to get both email and password
    return this.authService.login(dto);
  }

  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: OtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }
}

