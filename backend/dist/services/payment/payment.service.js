"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mock_payment_provider_1 = require("./mock.payment.provider");
const wave_payment_provider_1 = require("./wave.payment.provider");
const other_payment_providers_1 = require("./other.payment.providers");
class PaymentService {
    static providers = new Map();
    static {
        // Enregistrement des providers disponibles
        this.registerProvider('MOCK', new mock_payment_provider_1.MockPaymentProvider());
        this.registerProvider('WAVE', new wave_payment_provider_1.WavePaymentProvider());
        this.registerProvider('ORANGE_MONEY', new other_payment_providers_1.OrangeMoneyPaymentProvider());
        this.registerProvider('INTOUCH', new other_payment_providers_1.IntouchPaymentProvider());
        this.registerProvider('CARD', new other_payment_providers_1.CardPaymentProvider());
    }
    static registerProvider(name, provider) {
        this.providers.set(name.toUpperCase(), provider);
    }
    static getProvider(method, forceMock = true) {
        // Pour le prototype de démonstration, nous utilisons le MockPaymentProvider
        // tout en conservant l'architecture prête pour le branchement direct des providers réels
        if (forceMock) {
            return this.providers.get('MOCK') || new mock_payment_provider_1.MockPaymentProvider();
        }
        const provider = this.providers.get(method.toUpperCase());
        return provider || this.providers.get('MOCK');
    }
    static async processPayment(request, forceMock = true) {
        const provider = this.getProvider(request.method, forceMock);
        return await provider.initiatePayment(request);
    }
}
exports.PaymentService = PaymentService;
