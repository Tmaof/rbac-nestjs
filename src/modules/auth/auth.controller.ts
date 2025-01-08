import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { getCommonRes } from '@/utils';


@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor (private authService: AuthService,) {}

    /** 登录 */
    @Post('/signin')
    async signin (@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        const token = await this.authService.signin(username, password);
        return getCommonRes({ data: { token } });
    }

    /** 注册 */
    @Post('/signup')
    async signup (@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        const data = await this.authService.signup(username, password);
        return getCommonRes({ data });
    }
}
