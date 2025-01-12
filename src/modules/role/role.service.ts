import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { Permission } from '../permission/permission.entity';
import { GetRoleListDto, GetRolePermissionsDto, GetRolePermissionsListItem } from './dto-res/get.dto';
import { PermissionService } from '../permission/permission.service';
import { GetPermissionListDto } from '../permission/dto-res/get.dto';

@Injectable()
export class RolesService {
    constructor (
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        private permissionService: PermissionService,
    ) {}

    /** 查询所有角色 */
    async getRoleList () {
        const roles = await this.roleRepository.find({ relations: ['permission'] });

        const res:GetRoleListDto = [];
        for (const role of roles) {
            const { id, name, describe, permission } = role;
            const names = permission.map(item => item.name);
            const permissions = permission.map(item => item.id);

            res.push({ id, name, describe, permissions, names });
        }
        return { data: res };
    }

    /** 获取指定角色的权限（用于分配权限） */
    async getRolePermission (roleId:number) {
        const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permission'] });
        if (!role) {
            return { message: '角色不存在' };
        }

        /** 该角色拥有的权限id列表。 */
        const selected:GetRolePermissionsDto['selected'] = role.permission.map(item => item.id);
        /** 权限列表-添加 select 标记 */
        const list:GetRolePermissionsDto['list'] = [];

        /** 所有的权限的列表-权限树 */
        const { data: permissionList } = await this.permissionService.getPermissionList();

        /** 递归函数，为 每个权限 添加 select 标记 */
        const addSelectFlag = (permissionList:GetPermissionListDto, resList:GetRolePermissionsDto['list'], selectedList:number[]) => {
            for (const permission of permissionList) {
                const { id, pid, name, code, type, children } = permission;
                const select = selectedList.includes(id) ? 1 : 0;
                const item:GetRolePermissionsListItem = { id, pid, name, code, type, select, children: [] };
                if (children.length > 0) {
                    addSelectFlag(children, item.children, selectedList);
                }
                resList.push(item);
            }
        };
        addSelectFlag(permissionList, list, selected);

        const data:GetRolePermissionsDto = { selected, list };
        return { data };
    }

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
