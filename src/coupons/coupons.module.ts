import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './coupon.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), AuthModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports:[CouponsService]
})
export class CouponsModule {}
