import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRolePermissionDto {
    @IsNumber()
    @IsNotEmpty()
        roleId: number;

    @IsArray()
    @IsNotEmpty()
        permissionIdList: number[];
}
