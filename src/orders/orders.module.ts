import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Users])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
