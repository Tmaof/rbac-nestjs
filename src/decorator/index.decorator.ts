import { IS_PUBLIC_KEY } from '@/constant';
import { SetMetadata } from '@nestjs/common';


/**
 * 创建了一个Public装饰器，它使用SetMetadata函数将IS_PUBLIC_KEY设置为true。
 * 接下来，你可以在需要标记为公共的路由处理函数上使用@Public装饰器，
 * 这意味着这个路由是公共的，不需要身份验证即可访问。
 * ps: 需要在JwtGuard中检查isPublic元数据。
 * @returns
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
