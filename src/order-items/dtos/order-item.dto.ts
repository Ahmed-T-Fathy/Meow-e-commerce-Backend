import { Expose, Type } from "class-transformer";
import { ProductVariantDTO } from "src/product-variants/dtos/product-variant.dto";

export class OrderItemDTO{
    @Expose()
    id:string

    // @Expose()
    // @Type(() => UserIdDTO)  // Transform the user to expose only the `id`
    // user: UserIdDTO;

    @Expose()
    quantity:number;

    @Expose()
    price:number;

    @Expose()
    @Type(()=>ProductVariantDTO)
    product_variant:ProductVariantDTO;

}