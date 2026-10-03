"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = require("../utils/prisma");
class NotificationService {
    /**
     * Envoi simulé et archivage dans la base de données
     */
    static async send(payload) {
        try {
            const record = await prisma_1.prisma.notification.create({
                data: {
                    type: payload.type,
                    recipient: payload.recipient,
                    subject: payload.subject || null,
                    content: payload.content,
                    status: 'SENT',
                    sentAt: new Date()
                }
            });
            return record;
        }
        catch (error) {
            console.error('Erreur lors de l’envoi de la notification :', error);
            return null;
        }
    }
    static async notifyBookingConfirmed(customerEmail, customerPhone, reference, vehicleName, totalAmount) {
        // 1. Email
        await this.send({
            type: 'EMAIL',
            recipient: customerEmail,
            subject: `Confirmation de votre réservation ${reference} - Hertz Digital`,
            content: `Bonjour, votre réservation ${reference} pour le véhicule ${vehicleName} d'un montant de ${totalAmount.toLocaleString('fr-FR')} FCFA est bien enregistrée.`
        });
        // 2. WhatsApp
        await this.send({
            type: 'WHATSAPP',
            recipient: customerPhone,
            content: `🚘 Hertz Digital : Réservation ${reference} confirmée pour votre ${vehicleName}. Contrat et détails disponibles dans votre espace client.`
        });
        // 3. SMS
        await this.send({
            type: 'SMS',
            recipient: customerPhone,
            content: `Hertz: Resa ${reference} confirmee. Retrait prevu a l'agence. Merci de votre confiance.`
        });
    }
    static async notifyPaymentSuccess(customerEmail, customerPhone, paymentRef, amount, method) {
        await this.send({
            type: 'WHATSAPP',
            recipient: customerPhone,
            content: `✅ Paiement confirmé ! Votre règlement de ${amount.toLocaleString('fr-FR')} FCFA via ${method} (Réf: ${paymentRef}) a été validé.`
        });
        await this.send({
            type: 'EMAIL',
            recipient: customerEmail,
            subject: `Reçu de paiement ${paymentRef} - Hertz Digital`,
            content: `Votre paiement de ${amount.toLocaleString('fr-FR')} FCFA par ${method} a été validé avec succès. Votre contrat électronique certifié est téléchargeable.`
        });
    }
}
exports.NotificationService = NotificationService;
