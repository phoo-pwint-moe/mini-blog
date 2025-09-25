import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginUserDto): Promise<{
        access_token: string;
    } | {
        message: string;
    }>;
}
