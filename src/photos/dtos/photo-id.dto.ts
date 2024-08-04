import { IsNotEmpty, IsUUID } from "class-validator";

export class PhotoIdDTO{
    @IsUUID()
    @IsNotEmpty()
    id:string;
}