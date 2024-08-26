import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateOrderDTO{
    @IsNotEmpty()
    @IsString()
    address:string;
}