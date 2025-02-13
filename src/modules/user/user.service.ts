import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { Role } from '../role/role.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtPayloadParsed } from '../auth/types';
import { Permission } from '../permission/permission.entity';
import { PermissionTypeEnum } from '../permission/enum';
import { GetUserAllPagingDto, GetUserRoleDto } from './dto/get-user.dto';
import { FindAllExcelResDto } from './dto-res/get.dto';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}

    /** 获取当前用户的信息 */
    async getCurrentUser (jwtPayload:JwtPayloadParsed) {
        // console.log('jwtPayload', jwtPayload);
        const user = await this.userRepository.findOne({
            where: { id: jwtPayload.userId, username: jwtPayload.username },
            // relations: ['role', 'role.permission'],
            relations: ['role'],
        });

        if (!user) {
            return { message: '用户不存在' };
        }

        const queryList = user.role.map(item => ({ id: item.id }));

        let roles = [];
        if (queryList.length) {
            // queryList 不能为空，否则会报错。
            roles =  await this.roleRepository.find({ where: queryList, relations: ['permission'] });
        }

        /** 菜单权限 代码code 的列表 */
        const menus = new Set<string>();
        /** 按钮权限 代码code 的列表 */
        const points = new Set<string>();

        for (const role of roles) {
            for (const permission of role.permission) {
                // 为1代表页面权限，为2代表按钮权限。
                if (permission.type === PermissionTypeEnum.page) {
                    menus.add(permission.code);
                } else if (permission.type === PermissionTypeEnum.pont) {
                    points.add(permission.code);
                }
            }
        }

        const userInfo = {
            ...user,
            role: roles.map(item => item.id),
            permission: {
                menus: Array.from(menus),
                points: Array.from(points),
            },
        };

        delete userInfo.password;
        delete userInfo.log;
        return userInfo;
    }

    /** 获取用户的所有的权限代码 */
    async getUserPermCode (userId:number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });

        if (!user || !user.role.length) {
            return new Set<string>();
        }

        const queryList = user.role.map(item => ({ id: item.id }));
        let roles = [];
        if (queryList.length) {
            // queryList 不能为空，否则会报错。
            roles = await this.roleRepository.find({ where: queryList, relations: ['permission']  });
        }

        const codeList = new Set<string>();
        for (const role of roles) {
            for (const permission of role.permission) {
                codeList.add(permission.code);
            }
        }

        return codeList;
    }

    /** 查询用户-分页 */
    async findAllPaging (dto:GetUserAllPagingDto) {
        const { size, page } = dto;
        /** 步长 */
        const take = size || 2;
        /** 起始点 */
        const skip = ((page || 1) - 1) * take;

        const users = await this.userRepository.find({ relations: { role: true }, take, skip });
        users.forEach((user) => {
            delete user.password;
        });
        const total = await this.userRepository.count();
        return {
            list: users,
            total,
            page,
            size,
        };
    }

    /** 查询用户列表-(用于 Excel 导出) */
    async findAllExcel () {
        const users = await this.userRepository.find({
            select: {
                id: true,
                username: true,
                avatar: true,
                openTime: true,
            },
            relations: { role: true },
        });

        const data:FindAllExcelResDto = { list: [] };
        users.forEach((user) => {
            data.list.push({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                openTime: user.openTime.toDateString(),
                role: user.role.map((item) => item.name).join(','),
            });
        });
        return data;
    }

    /** 获取指定员工的角色（用于分配角色） */
    async findUserRole (dto:GetUserRoleDto) {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
            relations: { role: true },
        });

        return { role: user.role };
    }

    /** 根据用户名查询 */
    findByUsername (username: string) {
        return this.userRepository.findOne({
            where: { username },
            relations: ['role', 'role.permission'],
        });
    }

    /** 查询单个 */
    findOne (userId:number) {
        return this.userRepository.findOne({ where: { id: userId } });
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
                console.error(`用户名 ${username} 已存在，跳过该用户`);
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
    async remove (userId:number) {
        // return this.userRepository.delete(id);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return { message: '用户不存在' };
        }
        this.userRepository.remove(user);
        return { message: '删除成功' };
    }
}
