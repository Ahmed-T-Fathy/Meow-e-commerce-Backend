import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDTO } from './create-order.dto';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Orders_Status } from '../order-status';

export class UpdateOrderDTO {


  @IsNotEmpty()
  @IsEnum(Orders_Status)
  status: string;
}
