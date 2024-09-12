import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class AssignPhotosDTO {
  @IsString()
  @IsUUID()
  productId: string;

  // @IsString()
  // @IsUUID()
  // colorId: string;
}
