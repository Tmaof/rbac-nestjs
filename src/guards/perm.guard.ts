import { NEED_PERMISSION_CODE } from '@/constant';
import { PermissionInfo, permTree } from '@/constant/permCode';
import { UserService } from '@/modules/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 判断 该用户 是否有该api的权限。
 */
@Injectable()
export class PermGuard implements CanActivate {
    constructor (
        private reflector: Reflector,
        private userService: UserService,
    ) {}
    /** */
    async canActivate (context: ExecutionContext): Promise<boolean> {
        /** 具体路由 需要的 权限 */
        const routeNeedPerm = this.reflector.get<PermissionInfo>(
            NEED_PERMISSION_CODE,
            context.getHandler(),
        );

        /** 控制器 需要的 权限 */
        const controllerNeedPerm  = this.reflector.get<PermissionInfo>(
            NEED_PERMISSION_CODE,
            context.getClass(),
        );

        /**
         * 判断 该用户 是否有该api的权限。
         * 具体路由中标注的权限的优先级 比 控制器中标注的权限更高，
         * 如果一个路由没有标注权限，则使用控制器的权限来进行判断。
         */

        // 该接口不需要权限
        if (!routeNeedPerm && !controllerNeedPerm) {
            return true;
        }
        // 该接口需要权限

        // 判断是否有用户， 是否是有效用户
        const request = context.switchToHttp().getRequest();
        if (!request.user) {
            // 注意：使用 JwtGuard 之后 才添加 request.user
            console.warn('权限守卫：用户未登录，没有request.user');
            return false;
        }
        const user = await this.userService.findOne(request.user.userId);
        if (!user) {
            console.warn('权限守卫：用户不存在');
            return false;
        }

        /** 用户拥有的 权限码列表 */
        const userPermCodeSet = await this.userService.getUserPermCode(user.id);

        // 具体路由中标注的权限 的优先级 比 控制器中标注的权限更高
        if (routeNeedPerm) {
            // 该接口需要的权限的 权限码
            const needPermCode = routeNeedPerm.code;

            // 对用户公开的接口
            if (needPermCode === permTree.userPublic.code) {
                return true;
            }

            // 判断用户是否有该权限
            if (userPermCodeSet.has(needPermCode)) {
                return true;
            }
            console.warn(`权限守卫：用户 ${user.username} 没有 ${needPermCode} 权限`);
            return false;
        }

        // 该路由没有标注权限，则使用控制器的权限来进行判断。
        if (controllerNeedPerm) {
            // 该接口需要的权限的 权限码
            const needPermCode = controllerNeedPerm.code;

            // 对用户公开的接口
            if (needPermCode === permTree.userPublic.code) {
                return true;
            }

            // 判断用户是否有该权限
            if (userPermCodeSet.has(needPermCode)) {
                return true;
            }
            console.warn(`权限守卫：用户 ${user.username} 没有 ${needPermCode} 权限`);
            return false;
        }

        // 该接口需要权限
        console.warn(`权限守卫：用户 ${user.username} 没有该api权限`);
        return false;
    }
}
