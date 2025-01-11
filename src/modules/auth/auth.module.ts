import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';

@Global()
@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '15d' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [],
})

export class AuthModule {}
