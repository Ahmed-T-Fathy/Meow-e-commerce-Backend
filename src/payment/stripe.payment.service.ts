import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentStartegy } from './payment-strategy.interface';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripePayment implements PaymentStartegy {
  private stripe: Stripe;
  constructor(private readonly config: ConfigService) {
    // console.log("STRIPE_PRIVATE_KEY",this.config.get<string>('STRIPE_PRIVATE_KEY'));
    this.stripe = new Stripe(config.get<string>('STRIPE_PRIVATE_KEY'));
  }
  async processPayment(amount: number, orderId: string): Promise<boolean> {
    try {
      console.log('Starting Stripe session creation...');

      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_intent_data: {
          setup_future_usage: 'on_session',
        },
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Sample Product',
              },
              unit_amount: amount * 100, // Amount in cents (e.g., $20.00)
            },
            quantity: 1,
          },
        ],
        // customer: 'cus_QwYcEdbZQhx30r', // Omitted
        success_url:
          this.config.get<string>('HOST_BASE_URL') +
          '/pay/success/checout/session?session_id={CHECKOUT_SESSION_ID}',
        cancel_url:
          this.config.get<string>('HOST_BASE_URL') +
          '/pay/failed/checout/session',
        metadata: {
          orderId: orderId,
          amount: amount.toString(),
        },
      });

      console.log('Session created:', session);
      return true;
    } catch (err) {
      console.error('Error while creating Stripe session:', err);
      throw new InternalServerErrorException(err);
    }
  }

  
}
