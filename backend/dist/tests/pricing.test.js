"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pricing_service_1 = require("../services/pricing.service");
(0, vitest_1.describe)('PricingService', () => {
    (0, vitest_1.it)('calcule correctement la durée en jours entre deux dates', () => {
        const days = pricing_service_1.PricingService.calculateDurationDays('2026-04-01', '2026-04-06');
        (0, vitest_1.expect)(days).toBe(5);
    });
    (0, vitest_1.it)('gère au minimum 1 jour de location si dates identiques', () => {
        const days = pricing_service_1.PricingService.calculateDurationDays('2026-04-01', '2026-04-01');
        (0, vitest_1.expect)(days).toBe(1);
    });
    (0, vitest_1.it)('calcule correctement le montant total avec options en FCFA', () => {
        const dailyRate = 35000;
        const deposit = 200000;
        const durationDays = 5;
        const options = [
            { code: 'FULL_INSURANCE', name: 'Assurance Zéro Franchise', pricePerDay: 5000, quantity: 1 }
        ];
        const quote = pricing_service_1.PricingService.calculatePrice(dailyRate, deposit, durationDays, options);
        (0, vitest_1.expect)(quote.subtotal).toBe(175000); // 35000 * 5
        (0, vitest_1.expect)(quote.optionsTotal).toBe(25000); // 5000 * 5
        (0, vitest_1.expect)(quote.totalAmount).toBe(200000); // 175000 + 25000
        (0, vitest_1.expect)(quote.depositAmount).toBe(200000);
        (0, vitest_1.expect)(quote.oneWayFee).toBe(0);
    });
    (0, vitest_1.it)('calcule correctement les frais d’aller-simple (one-way) entre deux hubs sénégalais', () => {
        const feeAibdSaly = pricing_service_1.PricingService.calculateOneWayFee('AIBD_DAKAR', 'SALY_MBOUR');
        (0, vitest_1.expect)(feeAibdSaly).toBe(15000);
        const feeAibdStLouis = pricing_service_1.PricingService.calculateOneWayFee('AIBD_DAKAR', 'SAINT_LOUIS');
        (0, vitest_1.expect)(feeAibdStLouis).toBe(45000);
        const feeSameHub = pricing_service_1.PricingService.calculateOneWayFee('AIBD_DAKAR', 'AIBD_DAKAR');
        (0, vitest_1.expect)(feeSameHub).toBe(0);
    });
    (0, vitest_1.it)('intègre les frais one-way et l’option chauffeur VIP dans le montant global', () => {
        const dailyRate = 50000;
        const deposit = 300000;
        const durationDays = 3;
        const options = [
            { code: 'CHAUFFEUR_VIP', name: 'Service Chauffeur Privé VIP', pricePerDay: 25000, quantity: 1 }
        ];
        const quote = pricing_service_1.PricingService.calculatePrice(dailyRate, deposit, durationDays, options, 'AIBD_DAKAR', 'SALY_MBOUR');
        (0, vitest_1.expect)(quote.subtotal).toBe(150000); // 50000 * 3
        (0, vitest_1.expect)(quote.optionsTotal).toBe(75000); // 25000 * 3
        (0, vitest_1.expect)(quote.oneWayFee).toBe(15000); // AIBD -> Saly
        (0, vitest_1.expect)(quote.totalAmount).toBe(240000); // 150000 + 75000 + 15000
    });
});
