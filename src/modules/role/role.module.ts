import { Module } from '@nestjs/common';
import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from '../permission/permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission])],
    controllers: [RolesController],
    providers: [RolesService],
})
export class RolesModule {}
