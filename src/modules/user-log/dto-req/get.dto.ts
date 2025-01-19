import { IsNumber } from 'class-validator';

export class GetUserLogAllPagingDto {
    @IsNumber()
        page: number;

    @IsNumber()
        size?: number;
}
