import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Req,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { BlogGateway } from './blog.gateway';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './blog.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogGateway: BlogGateway,
  ) {}

  @ApiOperation({ summary: 'Get All Blogs' })
  @Post('get/:userId')
  async findAll(@Param('userId') userId: string): Promise<Blog[]> {
    try {
      if (!userId || userId.trim() === '') {
        throw new BadRequestException('userId is required');
      }
      return this.blogService.findAll();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get blog with id' })
  @Post(':id')
  async findOne(@Param('id') id: string): Promise<Blog | null> {
    return this.blogService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new blog' })
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post()
  async create(
    @Body() dto: CreateBlogDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Blog | null> {
    console.log(dto);

    console.log(images);
    const imagesUrl =
      images?.map((file) => `http://localhost:4000/uploads/${file.filename}`) ||
      [];
    let newBlog = await this.blogService.create(dto, dto.userId, imagesUrl);
     const notification = `${newBlog.userId['username']} created a new blog`;
    this.blogGateway.server.emit('new_blog', {
      blog: newBlog,
      notification,
    });

    return newBlog;
  }

  @ApiOperation({ summary: 'Update a new blog' })
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @Request() req,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Blog | null> {
    const imagesUrl = images.map(
      (file) => `http://localhost:4000/uploads/${file.filename}`,
    );
    return this.blogService.update(id, dto, req.user.userId, imagesUrl);
  }

  @ApiOperation({ summary: 'Delete blog' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<any> {
    return this.blogService.remove(id, req.user.userId);
  }
}
