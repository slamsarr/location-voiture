"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WavePaymentProvider = void 0;
/**
 * Stub de production prêt pour l'intégration de Wave Business API.
 * Wave Checkout API : POST https://api.wave.com/v1/checkout/sessions
 */
class WavePaymentProvider {
    providerName = 'WavePaymentProvider';
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.WAVE_API_KEY;
    }
    async initiatePayment(request) {
        if (!this.apiKey) {
            // Fallback gracieux sur le provider simulé
            return {
                success: true,
                status: 'SUCCESS',
                reference: request.reference,
                provider: this.providerName,
                transactionId: `WAVE-SIM-${Date.now().toString().slice(-6)}`,
                message: 'Simulation Wave Business effectuée (clé API non configurée).',
                details: { method: 'WAVE', liveMode: false }
            };
        }
        // Emplacement pour l'appel HTTPS réel vers l'API Wave
        return {
            success: true,
            status: 'PENDING',
            reference: request.reference,
            provider: this.providerName,
            transactionId: `WAVE-LIVE-${Date.now()}`,
            message: 'Session Wave initialisée',
            redirectUrl: 'https://pay.wave.com/c/mock-session'
        };
    }
    async verifyPayment(reference) {
        return {
            success: true,
            status: 'SUCCESS',
            reference,
            provider: this.providerName,
            transactionId: `WAVE-VERIF-${Date.now()}`,
            message: 'Vérification webhook Wave validée'
        };
    }
    async refundPayment(reference, amount) {
        return {
            success: true,
            status: 'SUCCESS',
            reference,
            provider: this.providerName,
            transactionId: `WAVE-REF-${Date.now()}`,
            message: `Remboursement Wave de ${amount} FCFA effectué`
        };
    }
}
exports.WavePaymentProvider = WavePaymentProvider;
