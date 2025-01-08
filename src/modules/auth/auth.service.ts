import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (private userService: UserService, private jwt: JwtService) {}

    /** 登录 */
    async signin (username: string, password: string) {
        const user = await this.userService.findByUsername(username);

        if (!user) {
            throw new ForbiddenException('用户不存在，请注册');
        }

        // 用户密码进行比对
        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            throw new ForbiddenException('用户名或者密码错误');
        }

        return await this.jwt.signAsync({
            username: user.username,
            id: user.id,
        });
    }

    /** 注册 */
    async signup (username: string, password: string) {
        const user = await this.userService.findByUsername(username);

        if (user) {
            throw new ForbiddenException('用户已存在');
        }

        const res = await this.userService.create({
            username,
            password,
        });

        return res;
    }
}
