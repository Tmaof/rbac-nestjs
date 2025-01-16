import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Param,
    Delete,
} from '@nestjs/common';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { getCommonRes } from '@/utils';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { JwtGuard } from '@/guards/jwt.guard';
import { PermGuard } from '@/guards/perm.guard';
import { permTree } from '@/constant/permCode';
import { setNeedPerm } from '@/decorator/index.decorator';

@Controller('role')
@setNeedPerm(permTree.permManage.children.roleList)
@UseGuards(JwtGuard, PermGuard)
export class RolesController {
    constructor (private readonly rolesService: RolesService) {}

    /** 获取角色列表 */
    @Get('list')
    async getRoleList () {
        const data = await this.rolesService.getRoleList();
        return getCommonRes(data);
    }

    /** 获取指定角色的权限（用于分配权限） */
    @Get('permission/:roleId')
    async getRolePermission (@Param('roleId') roleId: number) {
        const res = await this.rolesService.getRolePermission(roleId);
        return getCommonRes(res);
    }

    /** 添加角色 */
    @Post('add')
    @setNeedPerm(permTree.permManage.children.roleList.children.addRole)
    addRole (@Body() dto: CreateRoleDto) {
        this.rolesService.create(dto);
        return getCommonRes();
    }

    /** 更新角色的权限 */
    @Post('update/permission')
    @setNeedPerm(permTree.permManage.children.roleList.children.assignPerm)
    async updateRolePermission (@Body() dto: UpdateRolePermissionDto) {
        const data = await this.rolesService.updateRolePermission(dto);
        return getCommonRes(data);
    }

    /** 删除角色 */
    @Delete(':roleId')
    @setNeedPerm(permTree.permManage.children.roleList.children.deleteRole)
    async deleteRole (@Param('roleId') roleId: number) {
        const data = await this.rolesService.delete(roleId);
        return getCommonRes(data);
    }
}
