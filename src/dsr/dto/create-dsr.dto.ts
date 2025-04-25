import { IsInt, IsNotEmpty, Max, Min, IsString } from 'class-validator';

export class CreateDsrDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(1)
  @Max(8)
  hours: number;
}
