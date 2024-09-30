export interface PaymentStartegy {
  processPayment(amount: number, orderId: string): Promise<boolean>;
}
