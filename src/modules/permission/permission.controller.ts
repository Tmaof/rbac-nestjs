import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { getCommonRes } from '@/utils';

@Controller('permission')
@UseGuards()
export class RolesController {
    constructor (private readonly permissionService: PermissionService) {}

    /** 添加权限 */
    @Post('add')
    addRole (@Body() dto: CreatePermissionDto) {
        this.permissionService.create(dto);
        return getCommonRes();
    }

    /** 获取所有的权限 */
    @Get('list')
    async getPermissionList () {
        const res = await this.permissionService.getPermissionList();
        return getCommonRes(res);
    }
}
