import { IsNumber } from 'class-validator';

export class GetUserAllPagingDto {
    @IsNumber()
        page: number;

    @IsNumber()
        size?: number;
}
