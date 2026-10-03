import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../utils/prisma';
import { PaymentService } from '../services/payment/payment.service';
import { ContractService } from '../services/contract.service';
import { NotificationService } from '../services/notification.service';
import { InitiatePaymentDto } from '../types';

const isProduction = process.env.NODE_ENV === 'production';

function serverError(res: Response, error: any) {
  console.error('[PaymentController]', error);
  return res.status(500).json({
    error: isProduction ? 'Une erreur interne est survenue.' : error.message,
  });
}

export class PaymentController {
  public static async initiatePayment(req: Request, res: Response) {
    try {
      const dto: InitiatePaymentDto = req.body;

      if (!dto.reservationId || !dto.method) {
        return res.status(400).json({ error: 'reservationId et method sont obligatoires.' });
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: dto.reservationId },
        include: { customer: true, vehicle: true }
      });

      if (!reservation) {
        return res.status(404).json({ error: 'Réservation introuvable.' });
      }

      const year = new Date().getFullYear();
      const paymentReference = `PAY-${year}-${randomBytes(4).toString('hex').toUpperCase()}`;

      // Exécution via l'orchestrateur PaymentService
      const paymentResult = await PaymentService.processPayment({
        reservationId: reservation.id,
        reference: paymentReference,
        amount: reservation.totalAmount,
        currency: 'FCFA',
        method: dto.method,
        customerPhone: dto.customerPhone || reservation.customer.phone,
        customerEmail: reservation.customer.email,
        customerName: `${reservation.customer.firstName} ${reservation.customer.lastName}`,
        simulateStatus: dto.simulateStatus || 'SUCCESS'
      });

      // Sauvegarde de l'enregistrement de paiement
      const payment = await prisma.payment.create({
        data: {
          reference: paymentReference,
          reservationId: reservation.id,
          amount: reservation.totalAmount,
          currency: 'FCFA',
          method: dto.method,
          provider: paymentResult.provider,
          status: paymentResult.status,
          transactionDetails: JSON.stringify(paymentResult),
          paidAt: paymentResult.status === 'SUCCESS' ? new Date() : null
        }
      });

      let contract = null;

      // Si le paiement a réussi :
      if (paymentResult.status === 'SUCCESS') {
        // 1. Mettre à jour le statut de la réservation
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: 'PAID' }
        });

        // 2. Générer automatiquement le contrat électronique
        contract = await ContractService.generateContract(reservation.id);

        // 3. Envoyer la notification
        await NotificationService.notifyPaymentSuccess(
          reservation.customer.email,
          reservation.customer.phone,
          payment.reference,
          payment.amount,
          dto.method
        );
      }

      return res.json({
        ...paymentResult,
        payment,
        contract
      });
    } catch (error: any) {
      console.error('Payment controller error:', error);
      return serverError(res, error);
    }
  }

  public static async getPaymentByReference(req: Request, res: Response) {
    try {
      const { reference } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: {
          reservation: {
            include: { customer: true, vehicle: true }
          }
        }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Paiement introuvable.' });
      }

      return res.json(payment);
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  /**
   * Reçu officiel certifié de transaction (téléchargeable et imprimable)
   */
  public static async getPaymentReceipt(req: Request, res: Response) {
    try {
      const { reference } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: {
          reservation: {
            include: {
              customer: true,
              vehicle: { include: { category: true } },
              options: true,
              contract: true
            }
          }
        }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Reçu introuvable.' });
      }

      const receipt = {
        receiptNumber: `REC-${payment.reference.replace('PAY-', '')}`,
        issuedAt: payment.paidAt || payment.createdAt,
        payment: {
          reference: payment.reference,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          status: payment.status,
          transactionId: `TXN-${payment.id.substring(0, 8).toUpperCase()}`,
        },
        merchant: {
          name: 'Hertz Digital Rental Platform Sénégal',
          company: 'Hertz Mobility West Africa S.A.S.',
          address: 'Aéroport International Blaise Diagne (AIBD), Dakar, Sénégal',
          taxId: 'SN-DKR-2026-B-1428',
          phone: '+221 33 800 00 00',
          email: 'support@hertz-senegal.com',
          website: process.env.APP_URL || 'https://purple-cat-911761.hostingersite.com',
        },
        client: {
          name: `${payment.reservation.customer.firstName} ${payment.reservation.customer.lastName}`,
          email: payment.reservation.customer.email,
          phone: payment.reservation.customer.phone,
          address: payment.reservation.customer.address || 'Dakar, Sénégal',
        },
        reservation: {
          reference: payment.reservation.reference,
          dates: `${payment.reservation.startDate} au ${payment.reservation.endDate} (${payment.reservation.durationDays} jours)`,
          vehicle: `${payment.reservation.vehicle.brand} ${payment.reservation.vehicle.model} (${payment.reservation.vehicle.plateNumber})`,
          pickupLocation: payment.reservation.pickupLocation,
          returnLocation: payment.reservation.returnLocation,
          subtotal: payment.reservation.subtotal,
          optionsTotal: payment.reservation.optionsTotal,
          totalAmount: payment.reservation.totalAmount,
          deposit: payment.reservation.depositAmount,
        },
        verificationQrData: `${process.env.APP_URL || 'https://hertz-digital.com'}/recu/${payment.reference}`,
        isCertified: true,
      };

      return res.json(receipt);
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  /**
   * Webhook d'écoute pour passerelles de paiement réelles (Wave, Orange Money, InTouch)
   */
  public static async handleWebhook(req: Request, res: Response) {
    try {
      const { reference, status } = req.body;

      if (!reference) {
        return res.status(400).json({ error: 'Référence manquante dans le webhook' });
      }

      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: { reservation: { include: { customer: true } } }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Paiement introuvable' });
      }

      const newStatus = status === 'SUCCESS' ? 'SUCCESS' : (status === 'FAILED' ? 'FAILED' : 'PENDING');

      await prisma.payment.update({
        where: { reference },
        data: {
          status: newStatus,
          paidAt: newStatus === 'SUCCESS' ? new Date() : null,
          transactionDetails: JSON.stringify(req.body)
        }
      });

      if (newStatus === 'SUCCESS') {
        await prisma.reservation.update({
          where: { id: payment.reservationId },
          data: { status: 'PAID' }
        });
        await ContractService.generateContract(payment.reservationId);
      }

      return res.json({ received: true, status: newStatus });
    } catch (error: any) {
      console.error('Webhook error:', error);
      return serverError(res, error);
    }
  }
}

