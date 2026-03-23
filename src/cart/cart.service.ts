import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schema/products.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}
  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .lean();

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
      cart = await this.cartModel
        .findById(cart._id)
        .populate('items.product')
        .lean();
    }

    return cart;
  }
  async addToCart(userId: string, productId: string, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('რაოდენობა უნდა იყოს ერთზე მეტი!');
    }
    let product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('პროდუქტი ვერ მოიძებნა');
    }
    if (product.quantity < quantity) {
      throw new BadRequestException('მარაგში არ არის');
    }
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }
    const existingItem = cart.items.find((i) => {
      const productIdStr =
        i.product instanceof Types.ObjectId
          ? i.product.toString()
          : (i.product as { _id: Types.ObjectId })._id.toString();

      return productIdStr === productId;
    });

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: new Types.ObjectId(productId), quantity });
    }
    await cart.save();
    return this.getCart(userId);
  }
  async updateCartItem(userId: string, productId: string, quantity: number) {
    if (quantity < 1) return this.removeCartItem(userId, productId);

    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new NotFoundException('Product not in cart');

    item.quantity = quantity;
    await cart.save();
    return this.getCart(userId);
  }

  async removeCartItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    return this.getCart(userId);
  }
}
