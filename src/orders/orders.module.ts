import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Basket } from 'src/basket/basket.entity';
import { CouponsModule } from 'src/coupons/coupons.module';
import { TaxsModule } from 'src/taxs/taxs.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Users, Basket]),
    AuthModule,
    CouponsModule,
    TaxsModule,
    MailModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
