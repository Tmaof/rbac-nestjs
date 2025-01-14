import { UserLog } from '../user-log.entity';

/** 创建 用户日志 dto */
export class CreateUserLogDto {
    userId: number;

    logInfo: Partial<UserLog>;
}
