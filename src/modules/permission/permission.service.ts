import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { GetPermissionListDto, GetPermissionListItem } from './dto-res/get.dto';

@Injectable()
export class PermissionService {
    constructor (@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

    /** 创建 一个 权限 */
    async create (dto: CreatePermissionDto) {
        // 如果有父权限，则先找到父权限，然后再创建子权限
        if (dto.pid) {
            const parentPermission = await this.permissionRepository.findOne({ where: { id: dto.pid } });
            if (!parentPermission) {
                return { message: '父权限不存在' };
            }
            const newPermission = { ...dto, parentPermission };
            const permission = this.permissionRepository.create(newPermission);
            return await this.permissionRepository.save(permission);
        }

        // 如果没有父权限，则直接创建权限
        const permission = this.permissionRepository.create(dto);
        return await this.permissionRepository.save(permission);
    }

    /** 获取 权限列表-权限树 */
    async getPermissionList () {
        const permissionList = await this.permissionRepository.find({ relations: ['children', 'parentPermission'] });
        // 过滤出根权限
        const filterList = permissionList.filter(permission => !permission.parentPermission);
        const resList:GetPermissionListDto = [];

        /** 为 每个子权限中 添加 pid属性 */
        const addPid = (pid: number, permissionList: Permission[], resList: GetPermissionListDto) => {
            for (const permission of permissionList) {
                const dtoItem: GetPermissionListItem = { pid, name: permission.name, code: permission.code, type: permission.type, id: permission.id, children: [] };
                if (permission.children && permission.children.length > 0) {
                    addPid(permission.id, permission.children, dtoItem.children);
                }
                resList.push(dtoItem);
            }
        };
        addPid(-1, filterList, resList);
        return { data: resList };
    }
}
