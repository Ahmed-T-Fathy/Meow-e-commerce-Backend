import { IsBoolean, IsString } from 'class-validator';

export class AsignPhotosDTO {
//   @IsBoolean()
//   readonly is_main: boolean;

  @IsString()
  readonly productId: string;
}
