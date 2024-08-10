import { IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { Role } from "../roles.enum";

export class CreateUserDTO{
    @IsNotEmpty()
    @IsString()
    username:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phone:string;

    @IsNotEmpty()
    @IsStrongPassword()
    password:string;

    // @IsNotEmpty()
    // @IsEnum(Role)


}