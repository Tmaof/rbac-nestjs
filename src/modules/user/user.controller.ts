import { getCommonRes } from '@/utils';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { GetUserAllPagingDto, GetUserRoleDto } from './dto/get-user.dto';
import { UserService } from './user.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtGuard } from '@/guards/jwt.guard';
import { setNeedPerm } from '@/decorator/index.decorator';
import { permTree } from '@/constant/permCode';
import { PermGuard } from '@/guards/perm.guard';

@Controller('user')
@setNeedPerm(permTree.permManage.children.userList)
@UseGuards(JwtGuard, PermGuard)
export class UserController {
    constructor (private userService: UserService,) {
    }

    /** 获取当前用户的信息 */
    @Get('/profile')
    @setNeedPerm(permTree.userPublic)
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
    @setNeedPerm(permTree.permManage.children.userList.children.excelImport)
    async addUserBatch (@Body() dto: CreateUserBatchDto) {
        const data = await this.userService.createBatch(dto);
        return getCommonRes(data);
    }

    /** 更新用户角色 */
    @Post('update/role')
    @setNeedPerm(permTree.permManage.children.userList.children.assignRole)
    async updateUserRole (@Body() dto: UpdateUserRoleDto) {
        const data = await this.userService.updateUserRole(dto);
        return getCommonRes(data);
    }

    /** 删除用户 */
    @Delete('/:userId')
    @setNeedPerm(permTree.permManage.children.userList.children.deleteUser)
    async removeUser (@Param('userId') userId: number) {
        const data = await this.userService.remove(userId);
        return getCommonRes(data);
    }
}
