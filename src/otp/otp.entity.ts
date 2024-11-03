import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import crypto from 'crypto';
@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  otp: number;

  @Column({ nullable: true })
  token?: string;

  @Column()
  created_at: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.created_at = new Date();
  }

  generateOTP(): void {
    const otp: number = Math.floor(100000 + Math.random() * 900000);
    this.otp = otp;
  }

  isValid(): boolean {
    let gap =
      (new Date().getTime() - new Date(this.created_at).getTime()) / 1000;
    return gap <= 60;
  }

  getToken(): void {
    const genratedToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(genratedToken)
      .digest('hex');
    this.token = hashedToken;
  }

  isValidToken(): boolean {
    let gap =
      (new Date().getTime() - new Date(this.created_at).getTime()) / 1000;
    return gap <= 180;
  }
}
