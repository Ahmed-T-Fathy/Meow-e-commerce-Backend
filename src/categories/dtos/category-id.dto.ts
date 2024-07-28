import { IsNotEmpty, IsUUID } from "class-validator";

export class CategoryIdDTO{
    @IsUUID()
    @IsNotEmpty()
    id:string;
}