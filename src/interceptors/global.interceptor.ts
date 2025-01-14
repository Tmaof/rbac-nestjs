import { UserLogService } from '@/modules/user-log/user-log.service';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';


/**
 * 全局拦截器
 */
@Injectable()
export class GlobalInterceptor implements NestInterceptor {
    constructor (protected userLogService: UserLogService) {}
    /**  */
    intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
        /** 获取请求对象 */
        const request = context.switchToHttp().getRequest();
        const startTime = Date.now();

        /**
         * tap操作符
            用途：tap操作符用于在Observable流中的数据被订阅、发送或处理时执行副作用操作，而不改变流中的数据。它通常用于调试、记录日志或执行其他不影响数据流的操作。
          行为：tap操作符接收一个回调函数，该函数会在每次Observable发出值时被调用。回调函数可以访问发出的值，但不会改变它。tap操作符返回的Observable与原始Observable完全相同。
          map操作符
            用途：map操作符用于转换Observable流中的数据。它接收一个回调函数，该函数会在每次Observable发出值时被调用，并将返回的值作为新的Observable发出。
          行为：map操作符接收一个回调函数，该函数会对每个发出的值进行转换。回调函数的返回值会成为新的Observable发出的值。map操作符返回的Observable与原始Observable发出的值不同。
         */
        return next.handle().pipe(tap(async (data) => {
            // 记录用户操作日志
            this.userLogService.recordUserLog(request, data, startTime);
        }),
            // map((data) => {
            //     console.log(data);
            // }),
        );
    }
}
