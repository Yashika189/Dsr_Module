import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(dto: SignupDto) {
    const existingUser = await this.userModel.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    //const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto    });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'fullName', 'profilePicture', 'isVerified'], 
    });
  
    if (!user) {
      throw new NotFoundException('User not found');  // Throw an exception if no user is found
    }
  
    return user; // Return the user if found
  }
  

  async markAsVerified(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = true;
    await user.save();
  }

  async getProfile(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.getProfile(userId);
    await user.update(dto);
    return user;
  }
}

