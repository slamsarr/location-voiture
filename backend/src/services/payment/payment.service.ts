import { PaymentInitiationRequest, PaymentProvider, PaymentResult } from './payment.provider.interface';
import { MockPaymentProvider } from './mock.payment.provider';
import { WavePaymentProvider } from './wave.payment.provider';
import { OrangeMoneyPaymentProvider, IntouchPaymentProvider, CardPaymentProvider } from './other.payment.providers';
import { PaymentMethod } from '../../types';

export class PaymentService {
  private static providers: Map<string, PaymentProvider> = new Map();

  static {
    // Enregistrement des providers disponibles
    this.registerProvider('MOCK', new MockPaymentProvider());
    this.registerProvider('WAVE', new WavePaymentProvider());
    this.registerProvider('ORANGE_MONEY', new OrangeMoneyPaymentProvider());
    this.registerProvider('INTOUCH', new IntouchPaymentProvider());
    this.registerProvider('CARD', new CardPaymentProvider());
  }

  public static registerProvider(name: string, provider: PaymentProvider): void {
    this.providers.set(name.toUpperCase(), provider);
  }

  public static getProvider(method: PaymentMethod, forceMock = true): PaymentProvider {
    // Pour le prototype de démonstration, nous utilisons le MockPaymentProvider
    // tout en conservant l'architecture prête pour le branchement direct des providers réels
    if (forceMock) {
      return this.providers.get('MOCK') || new MockPaymentProvider();
    }

    const provider = this.providers.get(method.toUpperCase());
    return provider || this.providers.get('MOCK')!;
  }

  public static async processPayment(
    request: PaymentInitiationRequest, 
    forceMock = true
  ): Promise<PaymentResult> {
    const provider = this.getProvider(request.method, forceMock);
    return await provider.initiatePayment(request);
  }
}
