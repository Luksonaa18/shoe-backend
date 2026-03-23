import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
type JwtUser = {
  id: string;
  email: string;
};
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtUser) {
    return await this.userService.getMe(user.id);
  }
}
