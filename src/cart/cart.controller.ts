import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/user/user.controller';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@CurrentUser() user: JwtUser) {
    return await this.cartService.getCart(user.id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async addToCart(
    @CurrentUser() user: JwtUser,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.cartService.addToCart(user.id, productId, quantity);
  }
  
}
