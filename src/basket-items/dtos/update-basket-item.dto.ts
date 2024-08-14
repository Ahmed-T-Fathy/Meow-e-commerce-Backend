import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateBasketItemDTO {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
