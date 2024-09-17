import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTaxDTO{
    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsNumber()
    value:number;
}