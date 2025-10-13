import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './otp.schema';
import { EmailService } from './email.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { OtpExpirationListener } from './otp-expiration-listener.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    UserModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // use env variable in production
      signOptions: { expiresIn: '1h' },
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService, EmailService, JwtStrategy, OtpExpirationListener],
})
export class OtpModule {}
