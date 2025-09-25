import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
export type BlogDocument = Blog & Document;
export declare class Blog {
    title: string;
    content: string;
    images: string[];
    userId: User | Types.ObjectId;
}
export declare const BlogSchema: import("mongoose").Schema<Blog, import("mongoose").Model<Blog, any, any, any, Document<unknown, any, Blog, any, {}> & Blog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Blog, Document<unknown, {}, import("mongoose").FlatRecord<Blog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Blog> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
