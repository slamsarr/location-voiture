import { PaymentMethod, PaymentStatus } from '../../types';

export interface PaymentInitiationRequest {
  reservationId: string;
  reference: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
  simulateStatus?: 'SUCCESS' | 'FAILED';
}

export interface PaymentResult {
  success: boolean;
  status: PaymentStatus;
  reference: string;
  provider: string;
  transactionId: string;
  message: string;
  redirectUrl?: string;
  details?: Record<string, any>;
}

export interface PaymentProvider {
  readonly providerName: string;
  initiatePayment(request: PaymentInitiationRequest): Promise<PaymentResult>;
  verifyPayment(reference: string): Promise<PaymentResult>;
  refundPayment(reference: string, amount: number): Promise<PaymentResult>;
}
