import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateDsrDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  hours?: number;
}
