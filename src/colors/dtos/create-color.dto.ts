import { IsNotEmpty, IsString } from "class-validator";

export class CreateColorDTO{
    @IsNotEmpty()
    @IsString()
    color:string;

    @IsNotEmpty()
    @IsString()
    code:string;
}