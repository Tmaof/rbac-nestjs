import {
    Body, Controller, Delete, Get, Query, UseGuards
} from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { getCommonRes } from '@/utils';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';
import { DeleteUserLogByTimeRangeDto } from './dto-req/delete.dto';
import { PermGuard } from '@/guards/perm.guard';
import { JwtGuard } from '@/guards/jwt.guard';
import { permTree } from '@/constant/permCode';
import { setNeedPerm } from '@/decorator/index.decorator';

@Controller('user-log')
@UseGuards(JwtGuard, PermGuard)
@setNeedPerm(permTree.logManage.children.userLog)
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
    @setNeedPerm(permTree.logManage.children.userLog.children.deleteUserLog)
    async deleteUserlogByTimeRange (@Body() dto:DeleteUserLogByTimeRangeDto) {
        const res = await this.userLogService.deleteUserlogByTimeRange(dto);
        return getCommonRes(res);
    }
}
