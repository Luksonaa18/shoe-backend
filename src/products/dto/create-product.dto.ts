import { IsString, IsNumber, IsBoolean, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100) // limit title length
  title: string;

  @IsString()
  @MaxLength(500) // optional limit for description
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsBoolean()
  isInStock: boolean;
}