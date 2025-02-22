import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserLogAllPagingDto {
    @IsNotEmpty()
    @IsNumber()
        page: number;

    @IsNumber()
    @IsOptional()
        size?: number;

    @IsNumber()
    @IsOptional()
        userId?: number;

    @IsOptional()
    @IsString()
        startDateStr?: string;

    @IsOptional()
    @IsString()
        endDateStr?: string;

    @IsOptional()
    @IsString()
        sortBy?: string;

    @IsOptional()
    @IsString()
        sortOrder?: string;
}
