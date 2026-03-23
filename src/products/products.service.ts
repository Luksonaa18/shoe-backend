import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/products.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}
  async createProduct(dto: CreateProductDto): Promise<Product> {
    return await this.productModel.create(dto);
  }
  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }
  async findById(id: string): Promise<Product | null> {
    return await this.productModel.findById(id).exec();
  }
  async remove(id: string) {
  const product = await this.productModel.findByIdAndDelete(id);

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return { message: 'Product deleted successfully' };
}
}
