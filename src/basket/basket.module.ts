import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './basket.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { MailModule } from 'src/mail/mail.module';
import { CouponsModule } from 'src/coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Basket]),
    AuthModule,
    MailModule,
    CouponsModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
