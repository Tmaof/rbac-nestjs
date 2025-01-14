import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { UserLogModule } from './modules/user-log/user-log.module';

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
        UserLogModule,
    ],
    controllers: [],
    /** 可选的提供者列表，这些提供者将由 Nest 注入器实例化，并且至少可以在此模块之间共享。 */
    providers: [
        // 全局拦截器
        {
            provide: APP_INTERCEPTOR,
            useClass: GlobalInterceptor,
        },
    ],
})
export class AppModule {}
