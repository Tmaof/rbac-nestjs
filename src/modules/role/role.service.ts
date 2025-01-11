import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class RolesService {
    constructor (
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) {}

    /** 创建 一个 角色 */
    async create (dto: CreateRoleDto) {
        const role = this.roleRepository.create(dto);
        return await this.roleRepository.save(role);
    }

    /** 更新 角色的权限 */
    async updateRolePermission (dto:UpdateRolePermissionDto) {
        const { roleId, permissionIdList } = dto;
        if (permissionIdList.length === 0) {
            return;
        }

        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
            return { message: '角色不存在' };
        }

        const queryList = permissionIdList.map(item => {
            return { id: item };
        });
        const permission = await this.permissionRepository.find({ where: queryList });
        role.permission = permission;

        // 联合模型更新，需要使用save方法或者queryBuilder
        await this.roleRepository.save(role);
    }
}
