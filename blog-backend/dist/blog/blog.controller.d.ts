import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './blog.schema';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(): Promise<Blog[]>;
    findOne(id: string): Promise<Blog | null>;
    create(dto: CreateBlogDto, req: any, images: Express.Multer.File[]): Promise<Blog | null>;
    update(id: string, dto: UpdateBlogDto, req: any, images: Express.Multer.File[]): Promise<Blog | null>;
    remove(id: string, req: any): Promise<any>;
}
