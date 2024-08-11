import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDTO } from './create-order.dto';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderDTO {


  @IsNotEmpty()
  @IsEnum([
    'outstanding',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ])
  status: string;
}
