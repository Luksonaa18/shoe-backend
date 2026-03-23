import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
export type JwtUser = {
  id: string;
  email: string;
};
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtUser, @Req() req) {
    console.log('Incoming cookies:', req.cookies); // should show access_token
    console.log('User from JwtStrategy:', req.user);
    return await this.userService.getMe(user.id);
  }
}
