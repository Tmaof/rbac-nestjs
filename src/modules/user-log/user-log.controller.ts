import { Controller, Get, Query } from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { getCommonRes } from '@/utils';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';


@Controller('user-log')
export class UserLogController {
    constructor (private userLogService: UserLogService,) {
    }

    /** 查询用户日志列表-分页 */
    @Get('/paging')
    async  getUsersPaging (@Query() query: GetUserLogAllPagingDto) {
        const data = await this.userLogService.findAllPaging(query);
        return getCommonRes({ data });
    }
}
