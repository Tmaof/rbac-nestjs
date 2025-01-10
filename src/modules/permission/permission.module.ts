import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { RolesController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    controllers: [RolesController],
    providers: [PermissionService],
})
export class PermissionModule {}
