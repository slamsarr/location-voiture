"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPaymentProvider = exports.IntouchPaymentProvider = exports.OrangeMoneyPaymentProvider = void 0;
/**
 * Stub pour Orange Money Web Payment (OM Senegal / Côte d'Ivoire).
 */
class OrangeMoneyPaymentProvider {
    providerName = 'OrangeMoneyPaymentProvider';
    async initiatePayment(request) {
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
    async verifyPayment(reference) {
        return {
            success: true,
            status: 'SUCCESS',
            reference,
            provider: this.providerName,
            transactionId: `OM-VERIF-${Date.now()}`,
            message: 'Statut Orange Money vérifié'
        };
    }
    async refundPayment(reference, amount) {
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
exports.OrangeMoneyPaymentProvider = OrangeMoneyPaymentProvider;
/**
 * Stub pour agrégateur Intouch (TouchPay / InTouch Group).
 */
class IntouchPaymentProvider {
    providerName = 'IntouchPaymentProvider';
    async initiatePayment(request) {
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
    async verifyPayment(reference) {
        return {
            success: true,
            status: 'SUCCESS',
            reference,
            provider: this.providerName,
            transactionId: `INTOUCH-VERIF-${Date.now()}`,
            message: 'Paiement InTouch confirmé'
        };
    }
    async refundPayment(reference, amount) {
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
exports.IntouchPaymentProvider = IntouchPaymentProvider;
/**
 * Stub pour Carte Bancaire (Visa/Mastercard) via Stripe ou passerelle bancaire locale (GIM-UEMOA).
 */
class CardPaymentProvider {
    providerName = 'CardPaymentProvider';
    async initiatePayment(request) {
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
    async verifyPayment(reference) {
        return {
            success: true,
            status: 'SUCCESS',
            reference,
            provider: this.providerName,
            transactionId: `CARD-VERIF-${Date.now()}`,
            message: 'Paiement carte vérifié'
        };
    }
    async refundPayment(reference, amount) {
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
exports.CardPaymentProvider = CardPaymentProvider;
