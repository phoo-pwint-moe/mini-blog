import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
    } | undefined>;
    getProfile(req: any): {
        userId: any;
        username: any;
    };
}
