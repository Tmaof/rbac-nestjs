import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
    constructor (@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

    /** 创建 一个 权限 */
    async create (dto: CreatePermissionDto) {
        const role = this.permissionRepository.create(dto);
        return await this.permissionRepository.save(role);
    }
}
