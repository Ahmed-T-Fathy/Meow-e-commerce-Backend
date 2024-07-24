import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { BasketModule } from './basket/basket.module';
import { BasketItemsModule } from './basket-items/basket-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    AddressesModule,
    BasketModule,
    BasketItemsModule,
    OrdersModule,
    OrderItemsModule,
    ProductsModule,
    ReviewsModule,
    CategoriesModule,
    ProductVariantsModule,
    CouponsModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, CategoriesService],
})
export class AppModule {}
