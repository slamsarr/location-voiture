"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const payment_service_1 = require("../services/payment/payment.service");
const mock_payment_provider_1 = require("../services/payment/mock.payment.provider");
(0, vitest_1.describe)('PaymentService & MockPaymentProvider', () => {
    (0, vitest_1.it)('fournit par défaut le MockPaymentProvider pour le prototype', () => {
        const provider = payment_service_1.PaymentService.getProvider('WAVE', true);
        (0, vitest_1.expect)(provider).toBeInstanceOf(mock_payment_provider_1.MockPaymentProvider);
        (0, vitest_1.expect)(provider.providerName).toBe('MockPaymentProvider');
    });
    (0, vitest_1.it)('génère un paiement simulé avec succès', async () => {
        const result = await payment_service_1.PaymentService.processPayment({
            reservationId: 'test-res-1',
            reference: 'PAY-2026-TEST01',
            amount: 200000,
            currency: 'FCFA',
            method: 'WAVE',
            customerPhone: '+221 78 987 65 43',
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        (0, vitest_1.expect)(result.status).toBe('SUCCESS');
        (0, vitest_1.expect)(result.reference).toBe('PAY-2026-TEST01');
        (0, vitest_1.expect)(result.transactionId).toContain('TX-WAVE');
    });
    (0, vitest_1.it)('génère un échec simulé si explicitement demandé (scénario test refus)', async () => {
        const result = await payment_service_1.PaymentService.processPayment({
            reservationId: 'test-res-2',
            reference: 'PAY-2026-FAIL01',
            amount: 200000,
            currency: 'FCFA',
            method: 'ORANGE_MONEY',
            simulateStatus: 'FAILED',
        });
        (0, vitest_1.expect)(result.success).toBe(false);
        (0, vitest_1.expect)(result.status).toBe('FAILED');
        (0, vitest_1.expect)(result.transactionId).toContain('TX-FAIL');
    });
});
