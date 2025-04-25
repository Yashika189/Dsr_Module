import { IsEmail, IsString } from 'class-validator';

export class OtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
