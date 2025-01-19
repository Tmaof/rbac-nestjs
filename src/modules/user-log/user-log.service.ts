import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from './user-log.entity';
import { CreateUserLogDto } from './dto-req/post.dto';
import { UserService } from '../user/user.service';
import { JwtPayloadParsed } from '../auth/types';
import * as requestIp from 'request-ip';
import { objToJsonStr } from '@/utils';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';


@Injectable()
export class UserLogService {
    constructor (
        @InjectRepository(UserLog)
        private userLogRepository: Repository<UserLog>,
        private userService : UserService
    ) {}

    /** 添加 用户操作 日志 */
    async create (dto: CreateUserLogDto) {
        const { userId, logInfo } = dto;
        const user = await this.userService.findOne(userId);
        if (!user) {
            return { message: '用户不存在' };
        }

        const role = this.userLogRepository.create({ ...logInfo, user });
        const data = await this.userLogRepository.save(role);
        return { message: '添加成功', data };
    }

    /**
     * 在拦截器中，记录用户操作日志
     * @param request 请求对象
     * @param data 路由的响应数据
     * @param startTime 路由的开始时间
     */
    async recordUserLog (request, data, startTime:number) {
        const userInfo = request.user as JwtPayloadParsed;
        if (!userInfo) {
            return;
        }
        const user = await this.userService.findOne(userInfo.userId);
        if (!user) {
            return;
        }

        // 创建日志记录数据传输对象
        const logInfo = objToJsonStr({
            reqHeader: request.headers,
            reqQuery: request.query,
            reqBody: request.body,
            reqParams: request.params,
            time: new Date(),
            ip: requestIp.getClientIp(request),
            path: request.url,
            methods: request.method,
            resBody: data,
            handeTime: Date.now() - startTime,
        }, ['time', 'handeTime']);

        const createUserLogDto: CreateUserLogDto = {
            userId: user.id,
            logInfo,
        };
        // 调用user-log.service.ts的create方法创建日志记录
        this.create(createUserLogDto);
    }

    /** 查询用户日志-分页 */
    async findAllPaging (dto:GetUserLogAllPagingDto) {
        const { size, page } = dto;
        /** 步长 */
        const take = size || 2;
        /** 起始点 */
        const skip = ((page || 1) - 1) * take;

        const userLogs = await this.userLogRepository.find({ take, skip });
        const total = await this.userLogRepository.count();
        return {
            list: userLogs,
            total,
            page,
            size,
        };
    }
}
