import { PaymentInitiationRequest, PaymentProvider, PaymentResult } from './payment.provider.interface';

/**
 * Stub pour Orange Money Web Payment (OM Senegal / Côte d'Ivoire).
 */
export class OrangeMoneyPaymentProvider implements PaymentProvider {
  public readonly providerName = 'OrangeMoneyPaymentProvider';

  public async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference: request.reference,
      provider: this.providerName,
      transactionId: `OM-SIM-${Date.now().toString().slice(-6)}`,
      message: 'Simulation Orange Money effectuée avec succès.',
      details: { method: 'ORANGE_MONEY', otpVerified: true }
    };
  }

  public async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `OM-VERIF-${Date.now()}`,
      message: 'Statut Orange Money vérifié'
    };
  }

  public async refundPayment(reference: string, amount: number): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `OM-REF-${Date.now()}`,
      message: `Remboursement Orange Money de ${amount} FCFA effectué`
    };
  }
}

/**
 * Stub pour agrégateur Intouch (TouchPay / InTouch Group).
 */
export class IntouchPaymentProvider implements PaymentProvider {
  public readonly providerName = 'IntouchPaymentProvider';

  public async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference: request.reference,
      provider: this.providerName,
      transactionId: `INTOUCH-SIM-${Date.now().toString().slice(-6)}`,
      message: 'Transaction agrégée InTouch validée.',
      details: { method: 'INTOUCH', partnerNetwork: 'TouchPay' }
    };
  }

  public async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `INTOUCH-VERIF-${Date.now()}`,
      message: 'Paiement InTouch confirmé'
    };
  }

  public async refundPayment(reference: string, amount: number): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `INTOUCH-REF-${Date.now()}`,
      message: `Remboursement InTouch de ${amount} FCFA validé`
    };
  }
}

/**
 * Stub pour Carte Bancaire (Visa/Mastercard) via Stripe ou passerelle bancaire locale (GIM-UEMOA).
 */
export class CardPaymentProvider implements PaymentProvider {
  public readonly providerName = 'CardPaymentProvider';

  public async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference: request.reference,
      provider: this.providerName,
      transactionId: `CARD-SIM-${Date.now().toString().slice(-6)}`,
      message: 'Paiement par carte bancaire sécurisé 3D-Secure validé.',
      details: { method: 'CARD', threeDSecure: 'PASSED' }
    };
  }

  public async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `CARD-VERIF-${Date.now()}`,
      message: 'Paiement carte vérifié'
    };
  }

  public async refundPayment(reference: string, amount: number): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `CARD-REF-${Date.now()}`,
      message: `Remboursement carte de ${amount} FCFA opéré`
    };
  }
}
