import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(20)
  name: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @IsOptional()
  role: string;
}
