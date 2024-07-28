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
import { PhotosModule } from './photos/photos.module';
import { CategoriesController } from './categories/categories.controller';
import { Category } from './categories/category.entity';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config:ConfigService)=>{
        // console.log(config.get<string>('DB_HOST'))
        // console.log(config.get<string>('DB_PORT'))
        // console.log(config.get<string>('DB_USERNAME'))
        // console.log(config.get<string>('DB_PASSWORD'))
        // console.log(config.get<string>('DB_DATABASE'))
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          entities: [Category],
          logging: true,
          synchronize: true,
        }
      },
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
    CouponsModule,
    PhotosModule,
    ProductCategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
