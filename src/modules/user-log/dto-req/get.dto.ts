import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserLogAllPagingDto {
    @IsNotEmpty()
    @IsNumber()
        page: number;

    @IsNumber()
        size?: number;
}
