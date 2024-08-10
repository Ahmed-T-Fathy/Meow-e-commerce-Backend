import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { transformerOrderBy } from "../../transformers/transform-orderby.transformer";

export class CategoriesPaginationQueryDTO  {
    
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

    @IsOptional()
    @IsString()
    description?:string;
}
