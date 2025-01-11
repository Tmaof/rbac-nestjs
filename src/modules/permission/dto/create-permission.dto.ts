import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { PermissionTypeEnum } from '../enum';

export class CreatePermissionDto {
    /**  权限代码，与前端页面的实际情况结合。 */
    @IsNotEmpty()
    @IsString()
        code: string;
    /** 权限名。 */
    @IsNotEmpty()
    @IsString()
        name: string;
    /** 该权限的父权限id，如若添加根权限，pid要取-1。 */
    @IsNotEmpty()
    @IsNumber()
        pid: number;
    /**  权限类型，为1代表页面权限，为2代表按钮权限。 */
    @IsNotEmpty()
    @IsNumber()
        type: PermissionTypeEnum;
}


