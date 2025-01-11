import { getCommonRes } from '@/utils';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { GetUserAllPagingDto, GetUserRoleDto } from './dto/get-user.dto';
import { UserService } from './user.service';
import {
    Body,
    Controller,
    Get,
    Param,
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

    /** 查询用户列表-分页 */
    @Get('/paging')
    async  getUsersPaging (@Query() query: GetUserAllPagingDto) {
        const data = await this.userService.findAllPaging(query);
        return getCommonRes({ data });
    }

    /** 查询用户列表-(用于 Excel 导出) */
    @Get('/batch/excel')
    async getUsers () {
        const data = await this.userService.findAllExcel();
        return getCommonRes({ data });
    }

    /** 获取指定员工的角色（用于分配角色） */
    @Get('/role/:userId')
    async getUserRole (@Param() dto: GetUserRoleDto) {
        const data = await this.userService.findUserRole(dto);
        return getCommonRes({ data });
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
