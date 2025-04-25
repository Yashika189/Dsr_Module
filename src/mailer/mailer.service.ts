import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like SendGrid, SES, etc.
      auth: {
        user: "yashikasingh1592003@gmail.com",
        pass: "xzhd fvyo zabn odsa",
      },
    });
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    await this.transporter.sendMail(mailOptions);
  }
}
