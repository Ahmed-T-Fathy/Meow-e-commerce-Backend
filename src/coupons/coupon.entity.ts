import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { CouponType } from './coupon-type.enum';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  name: string;

  @Column({ type: 'text', default: CouponType.precentage })
  type: CouponType;

  @Column({ name: 'usage_limit' })
  usageLimit: number;

  @Column({ name: 'usage_no', default: 0 })
  usageNo: number;

  @Column()
  amount: number;

  @Column({ name: 'expiry_date', type: 'timestamp' })
  expiryDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }

  isValid(): boolean {
    let currentDate = new Date();
    return currentDate >= this.expiryDate || this.usageNo >= this.usageLimit;
  }

  getDiscount(total: number): number {
    if(this.isValid()){
      throw new BadRequestException("In valid Coupon!")
    }
    let res: number = total;
    if (this.type === CouponType.discount) {
      res -= this.amount;
      res = Math.max(0, res);
    } else if (this.type === CouponType.precentage) {
      let amount = Math.min(100, this.amount);
      res -= total * (amount / 100);
    }
    return res;
  }
   
}
