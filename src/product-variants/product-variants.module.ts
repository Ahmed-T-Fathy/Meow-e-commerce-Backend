import { Module } from '@nestjs/common';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './product-variant.entity';
import { Product } from 'src/products/product.entity';
import { Color } from 'src/colors/color.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant, Product, Color]),AuthModule],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
  exports:[ProductVariantsService]
})
export class ProductVariantsModule {}
