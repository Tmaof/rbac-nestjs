import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';


@Injectable()
export class AuthService {
    constructor (private userService: UserService) {}

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
