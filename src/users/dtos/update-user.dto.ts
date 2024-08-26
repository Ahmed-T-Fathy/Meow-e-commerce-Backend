import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { CreateUserDTO } from "./create-user.dto";
import {PartialType} from "@nestjs/mapped-types"
import { Role } from "../roles.enum";
import { Transform } from "class-transformer";
export class UpdateUserDTO extends PartialType(CreateUserDTO){

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === 'false' ? value === 'true' : value)
    is_verified:boolean;

    @IsOptional()
    @IsEnum(Role)
    role:Role;
}