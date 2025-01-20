import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadInfo, JwtPayloadParsed } from './types';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'config/env/config.enum';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (protected cs: ConfigService,) {
        // console.log('JWT_SECRET', cs.get(ConfigEnum.JWT_SECRET));
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: cs.get<string>(ConfigEnum.JWT_SECRET),
        });
    }

    /**
     * Passport将基于validate()方法的返回值构建一个user对象，
     * 并将其作为属性附加到请求对象上 req.user。
     */
    async validate (payload: JwtPayloadInfo) {
        const res: JwtPayloadParsed = { username: payload.username, userId: payload.id };
        return res;
    }
}
