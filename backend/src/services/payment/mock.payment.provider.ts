import { PaymentInitiationRequest, PaymentProvider, PaymentResult } from './payment.provider.interface';

export class MockPaymentProvider implements PaymentProvider {
  public readonly providerName = 'MockPaymentProvider';

  public async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentResult> {
    // Permet de simuler un échec si explicitement demandé pour tester le comportement d'erreur
    if (request.simulateStatus === 'FAILED') {
      return {
        success: false,
        status: 'FAILED',
        reference: request.reference,
        provider: this.providerName,
        transactionId: `TX-FAIL-${Date.now()}`,
        message: 'Transaction refusée par l’opérateur de paiement (solde insuffisant ou authentification échouée).',
        details: {
          failureCode: 'INSUFFICIENT_FUNDS_OR_AUTH_DECLINED',
          method: request.method,
          timestamp: new Date().toISOString()
        }
      };
    }

    // Par défaut, simule un succès immédiat ou quasi-immédiat
    return {
      success: true,
      status: 'SUCCESS',
      reference: request.reference,
      provider: this.providerName,
      transactionId: `TX-${request.method}-${Date.now().toString().slice(-6)}`,
      message: `Paiement ${request.method} validé avec succès.`,
      details: {
        method: request.method,
        amount: request.amount,
        currency: request.currency,
        phone: request.customerPhone,
        authorizedAt: new Date().toISOString()
      }
    };
  }

  public async verifyPayment(reference: string): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `TX-VERIF-${Date.now().toString().slice(-6)}`,
      message: 'Transaction vérifiée avec succès.'
    };
  }

  public async refundPayment(reference: string, amount: number): Promise<PaymentResult> {
    return {
      success: true,
      status: 'SUCCESS',
      reference,
      provider: this.providerName,
      transactionId: `REF-${Date.now().toString().slice(-6)}`,
      message: `Remboursement de ${amount} FCFA effectué.`
    };
  }
}
