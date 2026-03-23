import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type ProductDocument = Product & Document;
@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: Number, required: true })
  quantity: number;
  @Prop({ type: Boolean, required: true })
  isInStock: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
