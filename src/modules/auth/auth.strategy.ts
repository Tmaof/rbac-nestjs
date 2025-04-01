import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadInfo, JwtPayloadParsed } from './types';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '@/config/env/config.enum';
import { AuthService } from './auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        protected cs: ConfigService,
        private authService: AuthService
    ) {
        // console.log('JWT_SECRET', cs.get(ConfigEnum.JWT_SECRET));
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: cs.get<string>(ConfigEnum.JWT_SECRET),
            // 注意点: 如果为true，则validate方法的第一个参数为request对象，第二个参数为payload
            passReqToCallback: true,
        });
    }

    /**
     * Passport将基于validate()方法的返回值构建一个user对象，
     * 并将其作为属性附加到请求对象上 req.user。
     */
    async validate (req: Request, payload: JwtPayloadInfo) {
        // 获取 token
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        // 验证 token 是否已经退出登录
        const isValid = this.authService.validateToken(token);
        if (!isValid) {
            throw new UnauthorizedException('token已失效，请重新登录');
        }

        const res: JwtPayloadParsed = { token, username: payload.username, userId: payload.id };
        return res;
    }
}
