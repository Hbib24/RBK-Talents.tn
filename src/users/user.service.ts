import { User, UserDocument } from './user.model';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUser: UserDto) {
    const user = new this.userModel(createUser);
    let promise = await user.save();
    return promise;
  }

  async login(attempt: UserDto) {
    let user = await this.userModel.findOne({ email: attempt.email });

    if (!user) return { message: 'user does not exist', exists: false };

    // comparing passwords
    let isValid = await bcrypt.compare(attempt.password, user.password);

    if (isValid) {
      return {
        username: user.username,
        email: user.email,
        role: user.role,
        _id: user._id,
      };
    }
    return { message: 'password is not valid', exists: true };
  }

  async getCompanies() {
    let users = await this.userModel.find(
      { role: 'company' },
      { password: false },
    );

    return users;
  }

  async registerPass(id, pass) {
    let promise = await this.userModel.findByIdAndUpdate(id, {
      password: pass,
      status: 'ACTIVE',
    });
    return promise;
  }

  async getOne(id: string) {
    let promise = await this.userModel.findOne({ _id: id });
    return promise;
  }
}
