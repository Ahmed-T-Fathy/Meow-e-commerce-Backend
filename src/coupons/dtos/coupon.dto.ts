import { Expose } from 'class-transformer';

export class CouponDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  usageLimit: string;

  @Expose()
  usageNo: string;

  @Expose()
  amount: string;

  @Expose()
  expiryDate: string;

  @Expose()
  created_at: string;

}
