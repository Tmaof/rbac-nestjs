import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserLog } from '@/user-log/user-log.entity';
import { Role } from '@/role/role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, UserLog, Role])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
