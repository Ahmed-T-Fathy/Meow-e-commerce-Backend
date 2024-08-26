import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { transformerOrderBy } from "../../transformers/transform-orderby.transformer";
import { Role } from "../roles.enum";

export class UsersPaginationDTO  {
    
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
    username?:string;

    @IsOptional()
    @IsString()
    email?:string;

    @IsOptional()
    @IsString()
    phone?:string;

    @IsOptional()
    @IsEnum(Role)
    role?:Role;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === 'false' ? value === 'true' : value)
    is_verified?: boolean;
}
