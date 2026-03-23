import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async getMe(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new BadRequestException('მომხმარებელი არ არსებობს');
    }
    return user;
  }
}
