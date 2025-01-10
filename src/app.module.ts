import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';

const connectionParams:TypeOrmModuleOptions = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '0000',
    database: 'rbac-nest',
    entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    // 同步本地的schema与数据库 -> 初始化的时候去使用
    // synchronize: true,
    logging: true,
};

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot(connectionParams),
        UserModule,
        AuthModule,
        RolesModule,
        PermissionModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
