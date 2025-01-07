import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/user/user.module';

@Global()
@Module({
    imports: [
        UserModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [],
})

export class AuthModule {}
