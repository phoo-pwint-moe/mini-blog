import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  userId: string; 
}
