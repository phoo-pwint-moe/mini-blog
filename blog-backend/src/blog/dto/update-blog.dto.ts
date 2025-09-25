import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  existingImages?: string; // filenames of images to keep
}
