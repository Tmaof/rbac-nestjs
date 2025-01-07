import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';


@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor (private authService: AuthService,) {}


    /** 注册 */
    @Post('/signup')
    signup (@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        return this.authService.signup(username, password);
    }
}
