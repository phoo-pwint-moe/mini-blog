import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ required: true })
  userId: string; // email

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, expires: 300 })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
