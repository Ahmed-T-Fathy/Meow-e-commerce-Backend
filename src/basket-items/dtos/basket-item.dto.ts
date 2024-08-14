import { Expose, Type } from "class-transformer";
import { ProductVariantDTO } from "src/product-variants/dtos/product-variant.dto";

export class BasketItemDTO{
    @Expose()
    quantity:string;

    @Expose()
    @Type(()=>ProductVariantDTO)
    product_variant:ProductVariantDTO;

}