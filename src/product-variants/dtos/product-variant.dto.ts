import { Expose, Type } from "class-transformer";
import { ColorDTO } from "src/colors/dtos/color.dto";
import { ProductDTO } from "src/products/dtos/product.dto";

export class ProductVariantDTO{
    @Expose()
    size:string;
    
    @Expose()
    stock:number;

    @Expose()
    @Type(()=>ColorDTO)
    color:ColorDTO;

    @Expose()
    @Type(()=>ProductDTO)
    product:ProductDTO
}