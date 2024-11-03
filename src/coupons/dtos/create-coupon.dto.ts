import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { CouponType } from "../coupon-type.enum";
import { Type } from "class-transformer";

export class CreateCouponDTO{
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @MinLength(3)
    name:string;

    @IsNotEmpty()
    @IsEnum(CouponType)
    type:CouponType;

    @IsNotEmpty()
    @IsNumber()
    @Max(999)
    @Min(1)
    usageLimit:number;

    @IsNotEmpty()
    @IsNumber()
    @Max(999)
    @Min(1)
    amount:number;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    expiryDate:Date;
}