import { IsNotEmpty, IsString } from 'class-validator';


export class DeleteUserLogByTimeRangeDto {
    @IsNotEmpty()
    @IsString()
        startDateStr: string;

    @IsNotEmpty()
    @IsString()
        endDateStr:string;
}

