import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class UpdateUserRoleArg {
    @IsString()
    @IsNotEmpty()
        name: string;

    @IsNumber()
    @IsNotEmpty()
        id: number;
}

export class UpdateUserRoleDto {
    @IsNumber()
    @IsNotEmpty()
        userId: number;

    @IsArray()
    @IsNotEmpty()
        payload: UpdateUserRoleArg[];
}
