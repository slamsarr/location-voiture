import { BookingOptionItem, PriceBreakdown } from '../types';

export const ONE_WAY_FEES: Record<string, Record<string, number>> = {
  AIBD_DAKAR: {
    SALY_MBOUR: 15000,
    THIES_DIAMNIADIO: 10000,
    SAINT_LOUIS: 45000,
    TOUBA_MOUKADAMA: 35000,
    CAP_SKIRRING: 85000,
  },
  SALY_MBOUR: {
    AIBD_DAKAR: 15000,
    THIES_DIAMNIADIO: 15000,
    SAINT_LOUIS: 50000,
    TOUBA_MOUKADAMA: 35000,
    CAP_SKIRRING: 80000,
  },
  THIES_DIAMNIADIO: {
    AIBD_DAKAR: 10000,
    SALY_MBOUR: 15000,
    SAINT_LOUIS: 40000,
    TOUBA_MOUKADAMA: 30000,
    CAP_SKIRRING: 85000,
  },
  SAINT_LOUIS: {
    AIBD_DAKAR: 45000,
    SALY_MBOUR: 50000,
    THIES_DIAMNIADIO: 40000,
    TOUBA_MOUKADAMA: 40000,
    CAP_SKIRRING: 110000,
  },
  TOUBA_MOUKADAMA: {
    AIBD_DAKAR: 35000,
    SALY_MBOUR: 35000,
    THIES_DIAMNIADIO: 30000,
    SAINT_LOUIS: 40000,
    CAP_SKIRRING: 95000,
  },
  CAP_SKIRRING: {
    AIBD_DAKAR: 85000,
    SALY_MBOUR: 80000,
    THIES_DIAMNIADIO: 85000,
    SAINT_LOUIS: 110000,
    TOUBA_MOUKADAMA: 95000,
  },
};

export class PricingService {
  /**
   * Calcule le nombre de jours entre deux dates (minimum 1 jour).
   */
  public static calculateDurationDays(startDateStr: string, endDateStr: string): number {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 1;
    }

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  /**
   * Calcule les frais d'abandon / one-way fee si les agences sont différentes.
   */
  public static calculateOneWayFee(pickupLocation?: string, returnLocation?: string): number {
    if (!pickupLocation || !returnLocation || pickupLocation === returnLocation) {
      return 0;
    }
    const pickupHub = pickupLocation.toUpperCase();
    const returnHub = returnLocation.toUpperCase();
    if (ONE_WAY_FEES[pickupHub] && ONE_WAY_FEES[pickupHub][returnHub]) {
      return ONE_WAY_FEES[pickupHub][returnHub];
    }
    // Frais forfaitaire inter-villes par défaut
    return 20000;
  }

  /**
   * Calcule le devis complet dynamique en FCFA.
   */
  public static calculatePrice(
    dailyRate: number,
    deposit: number,
    durationDays: number,
    options: BookingOptionItem[] = [],
    pickupLocation?: string,
    returnLocation?: string
  ): PriceBreakdown {
    const subtotal = Math.round(dailyRate * durationDays);

    let optionsTotal = 0;
    for (const opt of options) {
      const qty = opt.quantity || 1;
      optionsTotal += Math.round(opt.pricePerDay * durationDays * qty);
    }

    const oneWayFee = this.calculateOneWayFee(pickupLocation, returnLocation);

    // Taxes incluses ou simulées à 0% dans ce modèle car affichées TTC en FCFA
    const taxTotal = 0; 
    const totalAmount = subtotal + optionsTotal + oneWayFee + taxTotal;

    return {
      durationDays,
      dailyRate,
      subtotal,
      optionsTotal,
      oneWayFee,
      taxTotal,
      totalAmount,
      depositAmount: deposit,
    };
  }
}
