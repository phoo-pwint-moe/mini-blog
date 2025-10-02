import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common'; 
import { Express } from 'express';
import { log } from 'console';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findAll(): Promise<Blog[]> {
    const blogs = await this.blogModel.find().populate('userId', 'username');
    return blogs;
  }

  async findOne(id: string): Promise<Blog | null> {
    return this.blogModel.findById(id).populate('userId', 'username');
  }

  async create(dto: CreateBlogDto, userId: string, files: string[]) {
    const newBlog = new this.blogModel({
      ...dto,
      userId: userId,
      images: files,
    });
    const save = await newBlog.save();
    return save.populate('userId', 'username');
  }
  async toggleLike(blogId: string, userId: string) {
    const blog = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException('Blog not found');

    const likedIndex = blog.likedBy.indexOf(userId);
    const dislikedIndex = blog.dislikedBy.indexOf(userId);

    if (likedIndex > -1) {
      blog.likedBy.splice(likedIndex, 1); 
    } else {
      blog.likedBy.push(userId);
      if (dislikedIndex > -1) blog.dislikedBy.splice(dislikedIndex, 1); 
    }

    await blog.save();
    return {
      likes: blog.likedBy.length,
      dislikes: blog.dislikedBy.length,
      likedBy: blog.likedBy,
      dislikedBy: blog.dislikedBy,
    };
  }

  async toggleDislike(blogId: string, userId: string) {
    const blog = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException('Blog not found');

    const dislikedIndex = blog.dislikedBy.indexOf(userId);
    const likedIndex = blog.likedBy.indexOf(userId);

    if (dislikedIndex > -1) {
      blog.dislikedBy.splice(dislikedIndex, 1); // remove dislike
    } else {
      blog.dislikedBy.push(userId); // add dislike
      if (likedIndex > -1) blog.likedBy.splice(likedIndex, 1); // remove like
    }

    await blog.save();
    return {
      likes: blog.likedBy.length,
      dislikes: blog.dislikedBy.length,
      likedBy: blog.likedBy,
      dislikedBy: blog.dislikedBy,
    };
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    userId: string,
    files: string[],
  ): Promise<Blog | null> {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');

    if (blog.userId.toString() !== userId)
      throw new ForbiddenException('You are not the owner');

    // Parse existing images
    let existingImages: string[] = [];
    if (dto.existingImages) {
      console.log(dto.existingImages);

      try {
        existingImages = JSON.parse(dto.existingImages);
      } catch (err) {
        throw new BadRequestException(
          'existingImages must be a JSON array of strings',
        );
      }
    }

    const removedImages = blog.images.filter(
      (img) => !existingImages.includes(img),
    );

    removedImages.forEach((img) => {
      if (!img) return; // skip null/undefined

      const fs = require('fs');
      const path = require('path');

      const relativeImg = img.replace(/^https?:\/\/[^/]+\//, '');
      const filePath = path.join(__dirname, '../../', relativeImg);

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Add new uploaded files
    const uploadedImages = files?.map((file) => file) || [];
    console.log('Uploaded Images:', uploadedImages);
    console.log(uploadedImages);

    // Merge images
    blog.images = [...existingImages, ...uploadedImages];

    // Update other fields
    blog.title = dto.title;
    blog.content = dto.content;

    return blog.save();
  }

  async remove(id: string, userId: string): Promise<any> {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');

    if (blog.userId.toString() !== userId)
      throw new ForbiddenException('You are not the owner');

    const fs = require('fs');
    const path = require('path');

    blog.images.forEach((img) => {
      if (!img) return; // skip null/undefined

      const fs = require('fs');
      const path = require('path');
      const relativeImg = img.replace(/^https?:\/\/[^/]+\//, '');
      const filePath = path.join(__dirname, '../../', relativeImg);

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    return this.blogModel.findByIdAndDelete(id).exec();
  }
}
