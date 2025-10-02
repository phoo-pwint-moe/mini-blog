import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type BlogDocument = Blog &
  Document & {
    userId: User | Types.ObjectId;
  };

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  images: string[];
  @Prop({ type: [String], default: [] })
  likedBy: string[];
  @Prop({ type: [String], default: [] })
  dislikedBy: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User | Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
