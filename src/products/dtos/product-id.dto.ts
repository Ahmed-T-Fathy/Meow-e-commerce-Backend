import { IsNotEmpty, IsUUID } from "class-validator";

export class ProductIdDTO{
    @IsUUID()
    @IsNotEmpty()
    id:string;
}