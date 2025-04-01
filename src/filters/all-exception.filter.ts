import { ResCodeEnum } from '@/enum';
import { getCommonRes } from '@/utils';
import {
    ExceptionFilter,
    HttpException,
    HttpStatus,
    ArgumentsHost,
    Catch
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

/** 全局异常处理 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor (private readonly httpAdapterHost: HttpAdapterHost,) {}

    /** */
    catch (exception, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        // const request = ctx.getRequest();
        const response = ctx.getResponse();

        const httpStatus = exception instanceof HttpException ? exception.getStatus()  : HttpStatus.INTERNAL_SERVER_ERROR;

        let msg = exception?.response?.message || exception?.message || 'Internal Server Error';

        // 数据库查询异常，获取更加准确的msg
        if (exception instanceof QueryFailedError) {
            msg = exception.message;
        }

        const res = getCommonRes({ success: false, code: ResCodeEnum.fail, message: msg });

        console.error(exception);

        httpAdapter.reply(response, res, httpStatus);
    }
}
