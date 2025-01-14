import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserLog } from '@/modules/user-log/user-log.entity';
import { Role } from '@/modules/role/role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Permission } from '../permission/permission.entity';

/**
 * 一旦导入到任何模块中，全局范围的模块将在所有模块中可见。
 * 此后，希望注入从全局模块导出的服务的模块不需要导入 provider 模块。
 *
 */
@Global()
@Module({
    /** TypeOrmModule.forFeature([User, Role, Permission]) 用于注册 User、Role 和 Permission 实体，并且使它们的仓库（UserRepository、RoleRepository 和 PermissionRepository）可以被注入到服务中。 */
    imports: [TypeOrmModule.forFeature([User, UserLog, Role, Permission])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
