import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor (@InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

    /** 查询所有 */
    findAll () {
        return this.userRepository.find();
    }

    /** 查询单个 */
    findOne () {

        // return this.userRepository.findOne();
    }

    /** 新增 */
    create () {
        // this.userRepository.create();
        // this.userRepository.save();
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
