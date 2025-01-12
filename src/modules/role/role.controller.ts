import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
} from '@nestjs/common';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { getCommonRes } from '@/utils';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Controller('role')
@UseGuards()
export class RolesController {
    constructor (private readonly rolesService: RolesService) {}

    /** 获取角色列表 */
    @Get('list')
    async getRoleList () {
        const data = await this.rolesService.getRoleList();
        return getCommonRes(data);
    }

    /** 添加角色 */
    @Post('add')
    addRole (@Body() dto: CreateRoleDto) {
        this.rolesService.create(dto);
        return getCommonRes();
    }

    /** 更新角色的权限 */
    @Post('update/permission')
    async updateRolePermission (@Body() dto: UpdateRolePermissionDto) {
        const data = await this.rolesService.updateRolePermission(dto);
        return getCommonRes(data);
    }
}
