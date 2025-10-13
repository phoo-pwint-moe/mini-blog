import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpConfirmDto } from './dto/otp-confirm.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  otpRequest(@Body() dto: OtpRequestDto) {
    return this.otpService.requestOtp(dto);
  }

  @Post('confirm')
  otpConfirm(@Body() dto: OtpConfirmDto) {
    return this.otpService.confirmOtp(dto);
  }
}
