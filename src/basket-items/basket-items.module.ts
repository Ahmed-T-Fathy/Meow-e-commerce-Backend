import { Module } from '@nestjs/common';
import { BasketItemsController } from './basket-items.controller';
import { BasketItemsService } from './basket-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketItem } from './basket-item.entity';
import { BasketModule } from 'src/basket/basket.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BasketItem]),
  BasketModule,
  ProductVariantsModule
],
  controllers: [BasketItemsController],
  providers: [BasketItemsService],
})
export class BasketItemsModule {}
