import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
export declare class BlogService {
    private blogModel;
    constructor(blogModel: Model<BlogDocument>);
    findAll(): Promise<Blog[]>;
    findOne(id: string): Promise<Blog | null>;
    create(dto: CreateBlogDto, userId: string, files: Express.Multer.File[]): Promise<Omit<import("mongoose").Document<unknown, {}, BlogDocument, {}, {}> & Blog & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, never>>;
    update(id: string, dto: UpdateBlogDto, userId: string, files: Express.Multer.File[]): Promise<Blog | null>;
    remove(id: string, userId: string): Promise<any>;
}
