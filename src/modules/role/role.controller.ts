import {
    Controller,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { getCommonRes } from '@/utils';

@Controller('role')
@UseGuards()
export class RolesController {
    constructor (private readonly rolesService: RolesService) {}

    /** 添加角色 */
    @Post('add')
    addRole (@Body() dto: CreateRoleDto) {
        this.rolesService.create(dto);
        return getCommonRes();
    }
}
