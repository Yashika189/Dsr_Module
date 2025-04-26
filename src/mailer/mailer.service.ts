import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "yashikasingh1592003@gmail.com",
        pass: "xzhd fvyo zabn odsa",
      },
    });
  }

  public async sendMail(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', mailOptions.to);
    } catch (error) {
      console.error(' Error sending email:', error.message);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  
  async sendForgetPasswordOtp(to: string, otp: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: "yashikasingh1592003@gmail.com",
      to,
      subject: 'Password Reset Request',
      text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <p>Hello,</p>
        <p>Your <b>OTP</b> for password reset is: <b>${otp}</b>.</p>
        <p><i>This OTP will expire in 5 minutes. If you did not request a password reset, please ignore this email.</i></p>
      `,
    };

    await this.sendMail(mailOptions);
  }
}
