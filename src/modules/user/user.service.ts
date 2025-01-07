import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    constructor (@InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

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

    /** 新增 */
    async create (user: Partial<User>) {
        const userTmp = this.userRepository.create(user);
        // console.log('userTmp', userTmp);
        // 对用户密码使用argon2加密
        userTmp.password = await argon2.hash(userTmp.password);
        const res = await this.userRepository.save(userTmp);
        return res;
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
