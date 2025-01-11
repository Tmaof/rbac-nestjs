import { getCommonRes } from '@/utils';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { GetUserAllPagingDto } from './dto/get-user.dto';
import { UserService } from './user.service';
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtGuard } from '@/guards/jwt.guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
    constructor (private userService: UserService,) {
    }

    /** 获取当前用户的信息 */
    @Get('/profile')
    async getCurrentUser (@Req() req) {
        const data = await this.userService.getCurrentUser(req.user);
        return getCommonRes({ data });
    }

    /** 查询用户 */
    @Get('/paging')
    async  getUsersPaging (@Query() query: GetUserAllPagingDto) {
        const data = await this.userService.findAllPaging(query);
        return getCommonRes({ data });
    }

    /** 查询用户 */
    @Get('')
    getUsers (@Query() query): any {
        // page - 页码，limit - 每页条数，condition-查询条件(username, role, gender)，sort-排序
        // 前端传递的Query参数全是string类型，需要转换成number类型
        // return this.userService.findAll(query);

        // eslint-disable-next-line no-console
        console.log(query);
    }

    /** 添加用户-批量-excel导入 */
    @Post('add/batch')
    async addUserBatch (@Body() dto: CreateUserBatchDto) {
        const data = await this.userService.createBatch(dto);
        return getCommonRes(data);
    }

    /** 更新用户角色 */
    @Post('update/role')
    async updateUserRole (@Body() dto: UpdateUserRoleDto) {
        const data = await this.userService.updateUserRole(dto);
        return getCommonRes(data);
    }
}
