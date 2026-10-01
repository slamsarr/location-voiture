import { describe, it, expect } from 'vitest';
import { PaymentService } from '../services/payment/payment.service';
import { MockPaymentProvider } from '../services/payment/mock.payment.provider';

describe('PaymentService & MockPaymentProvider', () => {
  it('fournit par défaut le MockPaymentProvider pour le prototype', () => {
    const provider = PaymentService.getProvider('WAVE', true);
    expect(provider).toBeInstanceOf(MockPaymentProvider);
    expect(provider.providerName).toBe('MockPaymentProvider');
  });

  it('génère un paiement simulé avec succès', async () => {
    const result = await PaymentService.processPayment({
      reservationId: 'test-res-1',
      reference: 'PAY-2026-TEST01',
      amount: 200000,
      currency: 'FCFA',
      method: 'WAVE',
      customerPhone: '+221 78 987 65 43',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('SUCCESS');
    expect(result.reference).toBe('PAY-2026-TEST01');
    expect(result.transactionId).toContain('TX-WAVE');
  });

  it('génère un échec simulé si explicitement demandé (scénario test refus)', async () => {
    const result = await PaymentService.processPayment({
      reservationId: 'test-res-2',
      reference: 'PAY-2026-FAIL01',
      amount: 200000,
      currency: 'FCFA',
      method: 'ORANGE_MONEY',
      simulateStatus: 'FAILED',
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe('FAILED');
    expect(result.transactionId).toContain('TX-FAIL');
  });
});
