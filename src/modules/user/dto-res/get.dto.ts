

export class FindAllExcelItemDto {
    id:number;

    username:string;

    openTime:string;

    avatar:string;

    role:string;
}

export class FindAllExcelResDto {
    list:FindAllExcelItemDto[];
}
