import { IsNotEmpty, IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsUUID } from "class-validator";

export class CreateOrderDTO{
    @IsNotEmpty()
    @IsString()
    address:string;

    @IsNotEmpty()
    @IsString()
    postalCode:string;

    @IsNotEmpty()
    @IsString()
    city:string;

    @IsNotEmpty()
    @IsString()
    zone:string;

    @IsNotEmpty()
    @IsString()
    location:string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber:string;

    @IsOptional()
    @IsString()
    coupon?:string;
}