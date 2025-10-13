// otp-expiration-listener.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './otp.schema';

@Injectable()
export class OtpExpirationListener implements OnModuleInit {
  private readonly logger = new Logger(OtpExpirationListener.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) {}

  async onModuleInit() {
    // Enable keyspace notifications in Redis CLI:
    // CONFIG SET notify-keyspace-events Ex
    const subscriber = this.redis.duplicate();
    await subscriber.psubscribe('__keyevent@0__:expired');

    subscriber.on('pmessage', async (pattern, channel, expiredKey) => {
      if (expiredKey.startsWith('otp:')) {
        const userId = expiredKey.split(':')[1];
        this.logger.warn(`⚠️ OTP expired for user ${userId}`);

        // Optional: update MongoDB record
        await this.otpModel.updateOne(
          { userId },
          { $set: { verified: false } },
        );

        // You could also trigger email or log analytics here
      }
    });

    this.logger.log('✅ OTP expiration listener initialized');
  }
}
