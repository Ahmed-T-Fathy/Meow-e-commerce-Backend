import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { transformerOrderBy } from "../../transformers/transform-orderby.transformer";

export class ColorsPaginationQueryDTO  {
    
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
    @Transform(transformerOrderBy)
    orderBy?: [{field:string,direction:'ASC'|'DESC'}];

    @IsOptional()
    @IsString()
    color?:string;

    @IsOptional()
    @IsString()
    code?:string;
}
