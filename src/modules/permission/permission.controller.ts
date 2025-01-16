import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Delete,
    Param,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { getCommonRes } from '@/utils';
import { permTree } from '@/constant/permCode';
import { setNeedPerm } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { PermGuard } from '@/guards/perm.guard';

@Controller('permission')
@setNeedPerm(permTree.permManage.children.menuList)
@UseGuards(JwtGuard, PermGuard)
export class PermissionController {
    constructor (private readonly permissionService: PermissionService) {}

    /** 添加权限 */
    @Post('add')
    @setNeedPerm(permTree.permManage.children.menuList.children.addPerm)
    addPermission (@Body() dto: CreatePermissionDto) {
        this.permissionService.create(dto);
        return getCommonRes();
    }

    /** 获取所有的权限 */
    @Get('list')
    async getPermissionList () {
        const res = await this.permissionService.getPermissionList();
        return getCommonRes(res);
    }

    /** 删除权限 */
    @Delete(':permissionId')
    @setNeedPerm(permTree.permManage.children.menuList.children.deletePerm)
    async deletePermission (@Param('permissionId') permissionId: number) {
        const res = await this.permissionService.delete(permissionId);
        return getCommonRes(res);
    }
}
