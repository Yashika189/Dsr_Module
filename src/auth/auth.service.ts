import { Injectable, UnauthorizedException,NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { OtpDto } from './dto/otp.dto';
import { randomInt } from 'crypto';
import { compare } from 'bcrypt';



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private mailerService: MailerService
  ) {}

  async signup(dto: SignupDto) {
    // 1️ Hash the user's password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const passwordMatches = await bcrypt.compare( dto.password,hashedPassword);

     console.log(passwordMatches)
     console.log(hashedPassword)

    // 2️ Save user with the hashed password
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    console.log(user)


    // 3️Generate an access token immediately
    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      message: 'Signup successful',
      accessToken: token,  //  Now user gets a token at signup
      user,
    };
  }


  async login(dto: LoginDto): Promise<any> {
    console.log(dto);

    const user = await this.userService.findByEmail(dto.email);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    console.log(user.dataValues);

    const passwordMatches = await bcrypt.compare( dto.password, user.dataValues.password);
    //const hashed=await bcrypt.hash(dto.password, 10);
    // console.log(hashed)
    console.log(dto.password);
    console.log(user.password);
    console.log(passwordMatches)
  
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
  

    const { password, ...sanitizedUser } = user.toJSON ? user.toJSON() : user;
  
    return {
      message: 'Login successful',
      accessToken,
      user: sanitizedUser,
    };
  }
  

  async sendOtp(email: string) {
    const otp = randomInt(100000, 999999).toString();

    await this.redisService.set(`otp:${email}`, otp, 300); // 5 minutes TTL
    console.log(email)
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    const savedOtp = await this.redisService.get(`otp:${email}`);

    if (!savedOtp) {
      throw new BadRequestException('OTP expired or invalid');
    }

    if (savedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.redisService.del(`otp:${email}`);
    await this.userService.markAsVerified(email);

    return { message: 'OTP verified successfully' };
  }
}
