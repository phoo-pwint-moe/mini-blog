"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blog_schema_1 = require("./blog.schema");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
let BlogService = class BlogService {
    blogModel;
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    async findAll() {
        const blogs = await this.blogModel.find().populate('userId', 'username');
        return blogs;
    }
    async findOne(id) {
        return this.blogModel.findById(id).populate('userId', 'username');
    }
    async create(dto, userId, files) {
        const imagePaths = files.map((file) => file.path);
        const newBlog = new this.blogModel({
            ...dto,
            userId: userId,
            images: imagePaths,
        });
        const save = await newBlog.save();
        return save.populate('userId', 'username');
    }
    async update(id, dto, userId, files) {
        const blog = await this.blogModel.findById(id);
        if (!blog)
            throw new common_2.NotFoundException('Blog not found');
        if (blog.userId.toString() !== userId)
            throw new common_2.ForbiddenException('You are not the owner');
        let existingImages = [];
        if (dto.existingImages) {
            console.log(dto.existingImages);
            try {
                existingImages = JSON.parse(dto.existingImages);
            }
            catch (err) {
                throw new common_3.BadRequestException('existingImages must be a JSON array of strings');
            }
        }
        const removedImages = blog.images.filter((img) => !existingImages.includes(img));
        removedImages.forEach((img) => {
            if (!img)
                return;
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../../', img);
            if (fs.existsSync(filePath))
                fs.unlinkSync(filePath);
        });
        const uploadedImages = files?.map((file) => file.path) || [];
        console.log('Uploaded Images:', uploadedImages);
        console.log(uploadedImages);
        blog.images = [...existingImages, ...uploadedImages];
        blog.title = dto.title;
        blog.content = dto.content;
        return blog.save();
    }
    async remove(id, userId) {
        const blog = await this.blogModel.findById(id);
        if (!blog)
            throw new common_2.NotFoundException('Blog not found');
        if (blog.userId.toString() !== userId)
            throw new common_2.ForbiddenException('You are not the owner');
        const fs = require('fs');
        const path = require('path');
        blog.images.forEach((img) => {
            if (!img)
                return;
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../../', img);
            if (fs.existsSync(filePath))
                fs.unlinkSync(filePath);
        });
        return this.blogModel.findByIdAndDelete(id).exec();
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogService);
//# sourceMappingURL=blog.service.js.map