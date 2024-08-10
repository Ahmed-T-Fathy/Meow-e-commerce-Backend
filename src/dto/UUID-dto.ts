import { IsNotEmpty, IsUUID } from "class-validator";

export class UUIDDTO{
    @IsUUID()
    @IsNotEmpty()
    id:string;
}