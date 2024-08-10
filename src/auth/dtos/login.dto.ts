import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDataDTO{
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string;
}