import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor (@InjectRepository(Role) private roleRepository: Repository<Role>) {}

    /** 创建 一个 角色 */
    async create (dto: CreateRoleDto) {
        const role = this.roleRepository.create(dto);
        return await this.roleRepository.save(role);
    }
}
