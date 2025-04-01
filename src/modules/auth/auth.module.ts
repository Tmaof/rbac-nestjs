import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '@/config/env/config.enum';

@Global()
@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (cs: ConfigService) => {
                // console.log('JWT_SECRET',  cs.get(ConfigEnum.JWT_SECRET));
                return {
                    secret: cs.get<string>(ConfigEnum.JWT_SECRET),
                    signOptions: { expiresIn: cs.get<string>(ConfigEnum.JWT_EXPIRES_IN) },
                };
            },

        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [],
})

export class AuthModule {}
