import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OtpConfirmDto {
  @IsEmail()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
