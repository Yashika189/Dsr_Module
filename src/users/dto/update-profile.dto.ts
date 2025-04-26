import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'The user\'s full name',
    required: false,  
  })
  fullName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://example.com/profile-pic.jpg',
    description: 'URL of the user\'s profile picture',
    required: false,  
  })
  profilePicture?: string;
}
