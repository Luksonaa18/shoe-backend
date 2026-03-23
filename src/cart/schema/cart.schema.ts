import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}
export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = Cart & Document;
CartSchema.index({ user: 1 }, { unique: true });
