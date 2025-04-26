
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user to reset the password',
  })
  email: string;
}
