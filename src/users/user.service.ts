import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  // Create new user
  async create(dto: SignupDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.userModel.create({ ...dto });

    return user;
  }

  // Find user by email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'fullName', 'profilePicture', 'isVerified'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Mark user as verified
  async markAsVerified(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    user.isVerified = true;
    await user.save();
  }

  // Get user profile by ID
  async getProfile(userId: number): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user profile
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.getProfile(userId);
    await user.update(dto);
    return user;
  }

  // Send OTP for password reset
  async sendOtpForPasswordReset(email: string): Promise<string> {
    const user = await this.findByEmail(email); 

    const otp = crypto.randomInt(100000, 999999).toString(); 

    // Save OTP to Redis with 5 minutes expiry
    await this.redisService.getClient().setEx(email, 300, otp);

    // Send OTP email
    await this.mailerService.sendForgetPasswordOtp(email, otp);

    return 'OTP has been sent to your email address';
  }

  // Verify OTP for password reset
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisService.getClient().get(email);
    return storedOtp === otp;
  }

  // Reset password 
  async resetPassword(email: string, otp: string, newPassword: string): Promise<string> {
    const user = await this.findByEmail(email);

    const isOtpValid = await this.verifyOtp(email, otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clean up OTP from Redis after successful reset
    await this.redisService.getClient().del(email);

    return 'Password has been successfully reset';
  }
}
