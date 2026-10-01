import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from '../services/payment/payment.service';
import { ContractService } from '../services/contract.service';
import { NotificationService } from '../services/notification.service';
import { InitiatePaymentDto } from '../types';

const prisma = new PrismaClient();

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

      const paymentReference = `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`;

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
      return res.status(500).json({ error: error.message });
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
      return res.status(500).json({ error: error.message });
    }
  }
}
