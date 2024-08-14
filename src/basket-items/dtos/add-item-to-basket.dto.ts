import { IsDecimal, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class AddItemIntoBasketDTO{

    @IsNotEmpty()
    @IsNumber()
    quantity:number;

    @IsNotEmpty()
    @IsUUID()
    product_variant_id:string;

    @IsNotEmpty()
    @IsUUID()
    basket_id:string;

}