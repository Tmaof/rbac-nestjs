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

    /**
     * 删除 权限。
     * 注意：
     * -删除权限时，会删除该权限的所有子权限（注意，该其中的子权限是否在其他父权限中有使用到）。
     * -若 角色-权限表 中有该权限（包括子权限），也会进行删除（使用了级联删除：{ cascade: ['remove'] }）。
     * -尝试删除 permission 表中的一行时，由于该行被外键约束引用，导致删除操作失败。这意味着如果一个权限是另一个权限的父权限，您就不能直接删除它。
     */
    async delete (permissionId: number) {
        // 创建一个新的QueryRunner实例
        const queryRunner = this.permissionRepository.manager.connection.createQueryRunner();
        // 连接到数据库
        await queryRunner.connect();
        // 开始一个新的事务
        await queryRunner.startTransaction();

        try {
            // 查找要删除的权限
            const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
            // 如果权限不存在，抛出一个错误
            if (!permission) {
                throw new Error('权限不存在');
            }

            // 查找并删除所有子权限
            const children = await this.permissionRepository.find({ where: { parentPermission: permission } });
            for (const child of children) {
                await this.permissionRepository.delete(child.id);
            }

            // 删除权限
            await this.permissionRepository.delete(permission.id);

            // 提交事务
            await queryRunner.commitTransaction();
            // 返回删除成功的消息
            return { message: '删除成功' };
        } catch (error) {
            // 如果发生错误，回滚事务
            await queryRunner.rollbackTransaction();
            // 返回删除失败的消息和错误信息
            console.log(error.message);
            return { message: `删除失败:${error.message}` };
        } finally {
            // 释放QueryRunner实例
            await queryRunner.release();
        }
    }
}
