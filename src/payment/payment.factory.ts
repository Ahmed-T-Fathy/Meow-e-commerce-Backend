import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { PaymentMethod } from "./payment-methods.enum";
import { PaymobPayment } from "./paymob.payment.service";
import { StripePayment } from "./stripe.payment.service";

@Injectable()
export class PaymentFactory{
    constructor (
        private stripePayment:StripePayment, 
        private paymobPayment:PaymobPayment
    ){
    }

    public getPaymentMethod(method:PaymentMethod){{
        switch(method){
            case PaymentMethod.paymob:
                return this.paymobPayment;
            case PaymentMethod.stripe:
                return this.stripePayment;
            default:
                throw new BadRequestException(`payment method ${method} not supported!`);
        }
    }}
}