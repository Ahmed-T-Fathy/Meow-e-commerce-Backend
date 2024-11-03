import { Module } from '@nestjs/common';
import { PaymentFactory } from './payment.factory';
import { StripePayment } from './stripe.payment.service';
import { PaymobPayment } from './paymob.payment.service';

@Module({
  providers: [PaymentFactory, StripePayment, PaymobPayment],
  exports: [PaymentFactory],
})
export class PaymentModule {}
