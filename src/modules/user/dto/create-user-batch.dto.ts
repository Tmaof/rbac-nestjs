import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

class CreateUserBatchArg {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20)
        username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
        password: string;

    @IsString()
        openTime?: Date;

    @IsString()
        role?: string;
}

export class CreateUserBatchDto {
    @IsArray()
        payload: CreateUserBatchArg[];
}
