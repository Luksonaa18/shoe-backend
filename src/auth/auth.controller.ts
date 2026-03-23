import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    // login returns { user, access_token, message }
    const result = await this.authService.login(dto);

    console.log('TOKEN:', result.access_token);

    // return both user and token for frontend to handle
    return {
      user: result.user,
      access_token: result.access_token,
      message: result.message,
    };
  }
}