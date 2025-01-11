import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserAllPagingDto {
    @IsNumber()
        page: number;

    @IsNumber()
        size?: number;
}


export class GetUserRoleDto {
    @IsNumber()
    @IsNotEmpty()
        userId: number;
}
