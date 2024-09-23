import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
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
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ColorsModule } from './colors/colors.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggingMiddleWare } from './middlewares/logging.middleware';
import { OtpModule } from './otp/otp.module';
import { TaxsModule } from './taxs/taxs.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: false, // Set to true if you have a valid certificate
          },
          entities: ['dist/**/*.entity{.ts,.js}'],
          logging: true,
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //    return {
    //       type: 'postgres',
    //       host: config.get<string>('DB_HOST'),
    //       port: config.get<number>('DB_PORT'),
    //       username: config.get<string>('DB_USERNAME'),
    //       password: config.get<string>('DB_PASSWORD'),
    //       database: config.get<string>('DB_DATABASE'),
    //       entities: ['dist/**/*.entity{.ts,.js}'],
    //       logging: true,
    //       synchronize: true,
    //     };
    //   },
    // }),
    UsersModule,
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ColorsModule,
    AuthModule,
    OtpModule,
    TaxsModule,
    MailModule,
  //   MailerModule.forRoot(
  //   //   {
  //   //   transport: {
  //   //     host: 'smtp.mailgun.org',
  //   //     port:587 ,
  //   //     auth: {
  //   //       user: 'postmaster@sandboxe75eacf0fbc84abeb8302c522d9b0782.mailgun.org',
  //   //       pass: '1163719efd8b76cc6fdaf4a55ab66f91-7a3af442-c0db74ad',
  //   //     },
  //   //   },
  //   // }
  // ),
    SmsModule,
    // MulterModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleWare).forRoutes('*');
  }
}
