import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { CouponType } from "../coupon-type.enum";
import { transformerOrderBy } from "src/transformers/transform-orderby.transformer";

export class CouponsPaginationQueryDTO{
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    page?:number=1;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?:number=10;

    @IsOptional()
    @Transform(transformerOrderBy)
    orderBy?: [{field:string,direction:'ASC'|'DESC'}];


    @IsOptional()
    @IsString()
    name?:string;

    // @IsOptional()
    // @Type(()=>Date)
    // @IsDate()
    // expiryDate:Date;

    @IsOptional()
    @IsEnum(CouponType)
    type:CouponType;
}