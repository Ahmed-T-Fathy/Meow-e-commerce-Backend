import { Injectable } from "@nestjs/common";
import { PaymentStartegy } from "./payment-strategy.interface";

@Injectable()
export class PaymobPayment implements PaymentStartegy{
    processPayment(amount: number, orderId: string): Promise<boolean> {
        console.log("Hello from Paymob!");
        return;
    }
}