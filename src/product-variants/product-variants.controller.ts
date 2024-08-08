import { Body, Controller, Post } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDTO } from './dtos/create-product-variant.dto';
import { ProductVariant } from './product-variant.entity';

@Controller('product-variants')
export class ProductVariantsController {
    constructor(private productVariantsService:ProductVariantsService){
    }
    @Post('')
    async createProductVariant(@Body() data:CreateProductVariantDTO):Promise<ProductVariant>{
        return await this.productVariantsService.createProductVariant(data);
    }
}
