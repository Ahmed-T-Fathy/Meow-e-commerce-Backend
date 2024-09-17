import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CouponType } from './coupon-type.enum';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: CouponType.precentage })
  type: CouponType;

  @Column({ name: 'usage_limit' })
  usageLimit: number;

  @Column({ name: 'usage_no', default: 0 })
  usageNo: number;

  @Column()
  amount:number;
  
  @Column({ name: 'expiry_date', type: 'timestamp' })
  expiryDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
