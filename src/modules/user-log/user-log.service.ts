import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserLog } from './user-log.entity';
import { CreateUserLogDto } from './dto-req/post.dto';
import { UserService } from '../user/user.service';
import { JwtPayloadParsed } from '../auth/types';
import * as requestIp from 'request-ip';
import { objToJsonStr } from '@/utils';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';
import { DeleteUserLogByTimeRangeDto } from './dto-req/delete.dto';
import { noResBodyPath } from './constant';

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
            resBody: noResBodyPath.find((path) => request.url.includes(path)) ? '' : data,
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
        const { size, page, userId, startDateStr, endDateStr, sortBy, sortOrder } = dto;
        /** 步长 */
        const take = size || 2;
        /** 起始点 */
        const skip = ((page || 1) - 1) * take;

        /** 查询条件 */
        const where: FindOneOptions<UserLog>['where'] = {};
        if (userId) {
            const user = await this.userService.findOne(userId);
            if (user) {
                where.user = user;
            } else {
                return { list: [], total: 0, page, size };
            }
        }
        if (startDateStr) {
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr || new Date());
            where.time = Between(startDate, endDate);
        }

        // 添加排序选项
        const order: FindManyOptions<UserLog>['order'] = {};
        if (sortBy) {
            order[sortBy] = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        } else {
            // 默认按时间降序排序
            order.time = 'DESC';
        }

        const userLogs = await this.userLogRepository.find({
            take,
            skip,
            where,
            relations: ['user'],
            order, // 添加排序条件
        });
        // 隐藏用户密码
        userLogs.forEach((userLog) => {
            userLog.user.password = undefined;
        });

        const total = await this.userLogRepository.count({ where });
        return {
            list: userLogs,
            total,
            page,
            size,
        };
    }

    /** 删除指定日期之间的日志 */
    async deleteUserlogByTimeRange (dto:DeleteUserLogByTimeRangeDto) {
        const { startDateStr, endDateStr } = dto;
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            return { message: '日期格式不正确' };
        }
        if (startDate > endDate) {
            return { message: '开始日期不能大于结束日期' };
        }

        // 先查询符合条件的记录数
        const count = await this.userLogRepository.count({ where: { time: Between(startDate, endDate) } });
        if (count === 0) {
            return { message: '指定时间范围内没有日志记录' };
        }

        // Between 是 TypeORM 提供的一个操作符，用于在数据库查询中指定一个范围。
        await this.userLogRepository.delete({ time: Between(startDate, endDate) });
    }
}
