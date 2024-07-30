import { Transform, Type } from "class-transformer";
import { IsDecimal, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { transformerOrderBy } from "../../transformers/transform-orderby.transformer";

export class ProductsPaginationQueryDTO{
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    page?:number=1;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(10)
    @Max(100)
    limit?:number=10;

    @IsOptional()
    @IsString()
    description?:string;

    @IsOptional()
    @Transform(transformerOrderBy)
    orderBy?: [{field:string,direction:'ASC'|'DESC'}];

    @IsOptional()
    @IsString()
    name?:string;

    @IsOptional()
    @IsDecimal()
    price?:number;

    @IsOptional()
    @IsDecimal()
    after_discount_price?:number;

}