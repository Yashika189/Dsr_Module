

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Invalid email address' }) // Passing an empty object as the first argument
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @Length(6, 32)
  newPassword: string;
}
