import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLog } from './user-log.entity';
import { UserLogController } from './user-log.controller';
import { UserLogService } from './user-log.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserLog])],
    controllers: [UserLogController],
    providers: [UserLogService],
    exports: [UserLogService],
})
export class UserLogModule {}
