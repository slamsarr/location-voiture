"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../utils/prisma");
const payment_service_1 = require("../services/payment/payment.service");
const contract_service_1 = require("../services/contract.service");
const notification_service_1 = require("../services/notification.service");
const isProduction = process.env.NODE_ENV === 'production';
function serverError(res, error) {
    console.error('[PaymentController]', error);
    return res.status(500).json({
        error: isProduction ? 'Une erreur interne est survenue.' : error.message,
    });
}
class PaymentController {
    static async initiatePayment(req, res) {
        try {
            const dto = req.body;
            if (!dto.reservationId || !dto.method) {
                return res.status(400).json({ error: 'reservationId et method sont obligatoires.' });
            }
            const reservation = await prisma_1.prisma.reservation.findUnique({
                where: { id: dto.reservationId },
                include: { customer: true, vehicle: true }
            });
            if (!reservation) {
                return res.status(404).json({ error: 'Réservation introuvable.' });
            }
            const year = new Date().getFullYear();
            const paymentReference = `PAY-${year}-${(0, crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`;
            // Exécution via l'orchestrateur PaymentService
            const paymentResult = await payment_service_1.PaymentService.processPayment({
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
            const payment = await prisma_1.prisma.payment.create({
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
                await prisma_1.prisma.reservation.update({
                    where: { id: reservation.id },
                    data: { status: 'PAID' }
                });
                // 2. Générer automatiquement le contrat électronique
                contract = await contract_service_1.ContractService.generateContract(reservation.id);
                // 3. Envoyer la notification
                await notification_service_1.NotificationService.notifyPaymentSuccess(reservation.customer.email, reservation.customer.phone, payment.reference, payment.amount, dto.method);
            }
            return res.json({
                ...paymentResult,
                payment,
                contract
            });
        }
        catch (error) {
            console.error('Payment controller error:', error);
            return serverError(res, error);
        }
    }
    static async getPaymentByReference(req, res) {
        try {
            const { reference } = req.params;
            const payment = await prisma_1.prisma.payment.findUnique({
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
        }
        catch (error) {
            return serverError(res, error);
        }
    }
}
exports.PaymentController = PaymentController;
