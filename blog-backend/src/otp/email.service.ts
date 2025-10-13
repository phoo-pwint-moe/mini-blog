import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'augustinamozart@gmail.com',
        pass: 'cdeg kjtc rooh tupi',
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: '"MyApp" <no-reply@myapp.com>',
      to,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
  }
}
