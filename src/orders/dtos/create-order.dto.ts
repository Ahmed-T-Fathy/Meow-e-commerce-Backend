import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateOrderDTO{
    @IsNotEmpty()
    @IsUUID()
    user_id:string;
}