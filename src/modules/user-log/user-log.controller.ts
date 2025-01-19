import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { getCommonRes } from '@/utils';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';
import { DeleteUserLogByTimeRangeDto } from './dto-req/delete.dto';


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

    /** 删除指定日期之间的日志 */
    @Delete('/time-range')
    async deleteUserlogByTimeRange (@Body() dto:DeleteUserLogByTimeRangeDto) {
        const res = await this.userLogService.deleteUserlogByTimeRange(dto);
        return getCommonRes(res);
    }
}
