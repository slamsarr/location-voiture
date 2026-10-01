import { describe, it, expect } from 'vitest';
import { PricingService } from '../services/pricing.service';

describe('PricingService', () => {
  it('calcule correctement la durée en jours entre deux dates', () => {
    const days = PricingService.calculateDurationDays('2026-04-01', '2026-04-06');
    expect(days).toBe(5);
  });

  it('gère au minimum 1 jour de location si dates identiques', () => {
    const days = PricingService.calculateDurationDays('2026-04-01', '2026-04-01');
    expect(days).toBe(1);
  });

  it('calcule correctement le montant total avec options en FCFA', () => {
    const dailyRate = 35000;
    const deposit = 200000;
    const durationDays = 5;
    const options = [
      { code: 'FULL_INSURANCE', name: 'Assurance Zéro Franchise', pricePerDay: 5000, quantity: 1 }
    ];

    const quote = PricingService.calculatePrice(dailyRate, deposit, durationDays, options);

    expect(quote.subtotal).toBe(175000); // 35000 * 5
    expect(quote.optionsTotal).toBe(25000); // 5000 * 5
    expect(quote.totalAmount).toBe(200000); // 175000 + 25000
    expect(quote.depositAmount).toBe(200000);
    expect(quote.oneWayFee).toBe(0);
  });

  it('calcule correctement les frais d’aller-simple (one-way) entre deux hubs sénégalais', () => {
    const feeAibdSaly = PricingService.calculateOneWayFee('AIBD_DAKAR', 'SALY_MBOUR');
    expect(feeAibdSaly).toBe(15000);

    const feeAibdStLouis = PricingService.calculateOneWayFee('AIBD_DAKAR', 'SAINT_LOUIS');
    expect(feeAibdStLouis).toBe(45000);

    const feeSameHub = PricingService.calculateOneWayFee('AIBD_DAKAR', 'AIBD_DAKAR');
    expect(feeSameHub).toBe(0);
  });

  it('intègre les frais one-way et l’option chauffeur VIP dans le montant global', () => {
    const dailyRate = 50000;
    const deposit = 300000;
    const durationDays = 3;
    const options = [
      { code: 'CHAUFFEUR_VIP', name: 'Service Chauffeur Privé VIP', pricePerDay: 25000, quantity: 1 }
    ];

    const quote = PricingService.calculatePrice(
      dailyRate,
      deposit,
      durationDays,
      options,
      'AIBD_DAKAR',
      'SALY_MBOUR'
    );

    expect(quote.subtotal).toBe(150000); // 50000 * 3
    expect(quote.optionsTotal).toBe(75000); // 25000 * 3
    expect(quote.oneWayFee).toBe(15000); // AIBD -> Saly
    expect(quote.totalAmount).toBe(240000); // 150000 + 75000 + 15000
  });
});
