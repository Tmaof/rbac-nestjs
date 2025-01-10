import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { Role } from '../role/role.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}

    /** 查询所有 */
    findAll () {
        return this.userRepository.find();
    }

    /** 根据用户名查询 */
    findByUsername (username: string) {
        return this.userRepository.findOne({
            where: { username },
            relations: ['role', 'role.permission'],
        });
    }

    /** 查询单个 */
    findOne () {

        // return this.userRepository.findOne();
    }

    /** 新增用户 */
    async create (user: Partial<User>) {
        const userTmp = this.userRepository.create(user);
        // console.log('userTmp', userTmp);
        // 对用户密码使用argon2加密
        userTmp.password = await argon2.hash(userTmp.password);
        const res = await this.userRepository.save(userTmp);
        return res;
    }

    /** 新增用户 批量 */
    async createBatch ({ payload }: CreateUserBatchDto) {
        const usersToSave:User[] = [];
        const messageList:string[] = [];

        for (const item of payload) {
            const { username, password, role = '', openTime = ''  } = item;

            // 检查用户名是否重复
            const existingUser = await this.userRepository.findOne({ where: { username } });
            if (existingUser) {
                // 如果用户名已存在，跳过该用户
                console.log(`用户名 ${username} 已存在，跳过该用户`);
                messageList.push(`用户名 ${username} 已存在，跳过该用户`);
                continue;
            }

            // 处理角色：以逗号分隔并确保角色存在
            const rolesArray = role.split(/,|，/).map(name => name.trim());
            const findList = rolesArray.map(name => ({ name }));
            const roles = await this.roleRepository.find({ where: findList });

            /**
             * 处理方式：
             * 处理1：如果有无效的角色，则跳过该用户
             * 处理2：角色名称如若不存在于角色列表中，则不会添加。
             */
            // if (roles.length !== rolesArray.length) {
            //     console.log(`角色 ${role} 不存在，跳过该用户`);
            //     continue;
            // }

            // 创建用户
            const user = this.userRepository.create({
                username,
                password: await argon2.hash(password),
                openTime: openTime ? new Date(openTime) : new Date(),
                /** 关联角色 */
                role: roles,
            });

            usersToSave.push(user);
        }

        const message = messageList.length === 0  ? '添加成功' : messageList.map((item, index) => `${index + 1}. ${item}\n`).join('');

        // 批量保存所有有效的用户
        if (usersToSave.length > 0) {
            await this.userRepository.save(usersToSave);
        }

        return { message };
    }

    /** 更新用户的角色 */
    async updateUserRole (dto:UpdateUserRoleDto) {
        const { userId, payload } = dto;
        if (payload.length === 0) {
            return;
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return { message: '用户不存在' };
        }

        const roles = await this.roleRepository.find({ where: payload });
        user.role = roles;
        // 联合模型更新，需要使用save方法或者queryBuilder
        await this.userRepository.save(user);

        // 下面的update方法，只适合单模型的更新，不适合有关系的模型更新
        // return this.userRepository.update(parseInt(userId), user);
    }

    /** 更新 */
    update () {
        // this.userRepository.update(parseInt(id), newUser)
    }

    /** 删除 */
    remove () {
        // this.userRepository.remove(user);
    }
}
