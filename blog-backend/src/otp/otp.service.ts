import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './otp.schema';
import { User } from '../user/user.schema';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpConfirmDto } from './dto/otp-confirm.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(dto: OtpRequestDto) {
    

    const user = await this.userModel.findOne({ _id: dto.userId });
    if (!user) throw new BadRequestException('User not found');

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const record = await this.otpModel.findOne({ userId: user._id });

    if (record) {
      record.otp = otp;
      record.expiresAt = expiresAt;
      record.verified = false;
      await record.save();
    } else {
      await this.otpModel.create({
        userId: user._id,
        otp,
        expiresAt,
      });
    }
    await this.redis.set(`otp:${user._id}`, otp, 'EX', 300);
    await this.emailService.sendOtpEmail(user.email, otp);

    return { message: 'OTP sent successfully' };
  }

  async confirmOtp(dto: OtpConfirmDto) {
    const user = await this.userModel.findOne({ _id: dto.userId });
    if (!user) throw new BadRequestException('User not found');

    const record = await this.otpModel.findOne({ userId: user._id });

    if (!record) throw new BadRequestException('No OTP found');
    if (record.expiresAt < new Date())
      throw new BadRequestException('OTP expired');
      const cachedOtp = await this.redis.get(`otp:${user._id}`);
      if (!cachedOtp) throw new BadRequestException('OTP expired');
      if (cachedOtp !== dto.otp) throw new BadRequestException('Invalid OTP');

    record.verified = true;
    await record.save();
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token: access_token,
      message: 'OTP verified successfully',
    };
  }
}
