import { IsNotEmpty, IsUUID } from "class-validator";

export class ColorIdDTO{
    @IsUUID()
    @IsNotEmpty()
    id:string;
}