import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class MailOptionDTO{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    to:string;

    @IsNotEmpty()
    @IsString()
    subject:string;

    @IsNotEmpty()
    @IsString()
    html:string;
}