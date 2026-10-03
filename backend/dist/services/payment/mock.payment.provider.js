"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentProvider = void 0;
class MockPaymentProvider {
    providerName = 'MockPaymentProvider';
    async initiatePayment(request) {
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
    async verifyPayment(reference) {
        return {
            success: true,
            status: 'SUCCESS',
            reference,
            provider: this.providerName,
            transactionId: `TX-VERIF-${Date.now().toString().slice(-6)}`,
            message: 'Transaction vérifiée avec succès.'
        };
    }
    async refundPayment(reference, amount) {
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
exports.MockPaymentProvider = MockPaymentProvider;
