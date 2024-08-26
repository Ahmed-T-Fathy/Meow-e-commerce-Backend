import { Expose } from 'class-transformer';

export class ColorDTO {
  @Expose()
  id: string;

  @Expose()
  color: string;

  @Expose()
  code: string;
}
