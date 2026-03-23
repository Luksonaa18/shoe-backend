import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from 'src/user/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password, role } = dto;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await this.userModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new BadRequestException('მომხმარებელი ამ ელფოსტით უკვე არსებობს');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'USER',
    });

    const access_token = await this.jwtService.signAsync({
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'USER',
    });

    return {
      message: 'რეგისტრაცია წარმატებით დასრულდა',
      access_token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'USER',
      },
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.userModel
      .findOne({ email: normalizedEmail })
      .select('+password');

    if (!user) {
      throw new BadRequestException('მომხმარებელი ამ ელფოსტით არ არსებობს');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('არასწორი მონაცემები');
    }

    const access_token = await this.jwtService.signAsync({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      message: 'ავტორიზაცია წარმატებით დასრულდა',
      access_token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
