import { getUserDto } from './dto/get-user.dto';
import { UserService } from './user.service';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor (private userService: UserService,) {
    }

    /** 查询用户 */
    @Get('')
    getUsers (@Query() query: getUserDto): any {
        // page - 页码，limit - 每页条数，condition-查询条件(username, role, gender)，sort-排序
        // 前端传递的Query参数全是string类型，需要转换成number类型
        // return this.userService.findAll(query);

        // eslint-disable-next-line no-console
        console.log(query);
    }
}
