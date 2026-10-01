"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ContractService {
    /**
     * Génère ou récupère le contrat électronique d'une réservation
     */
    static async generateContract(reservationId) {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                customer: true,
                vehicle: {
                    include: { category: true }
                },
                options: true,
                payments: true,
                contract: true,
            }
        });
        if (!reservation) {
            throw new Error('Réservation introuvable pour la génération du contrat.');
        }
        if (reservation.contract) {
            return reservation.contract;
        }
        const reference = `CTR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const contract = await prisma.contract.create({
            data: {
                reference,
                reservationId: reservation.id,
                status: 'ISSUED',
                signedAt: now,
                termsAccepted: true,
            }
        });
        return contract;
    }
    /**
     * Retourne les données complètes et formatées du contrat pour l'affichage et l'export PDF
     */
    static async getContractDetails(reservationId) {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                customer: true,
                vehicle: {
                    include: { category: true }
                },
                options: true,
                payments: true,
                contract: true,
            }
        });
        if (!reservation) {
            throw new Error('Réservation introuvable');
        }
        let contract = reservation.contract;
        if (!contract) {
            contract = await this.generateContract(reservationId);
        }
        return {
            contract,
            reservation,
            company: {
                name: 'Hertz Digital Rental Platform',
                legalEntity: 'Hertz Mobility West Africa S.A.S.',
                address: 'Boulevard de la République, Dakar, Sénégal',
                phone: '+221 33 800 00 00 / +221 77 000 00 00',
                email: 'reservations@hertz-digital.demo',
                taxId: 'SN-DKR-2026-B-1428',
            },
            terms: [
                'Le locataire s’engage à restituer le véhicule avec le même niveau de carburant qu’à la prise en charge.',
                'La caution sera débloquée ou restituée intégralement après l’état des lieux retour conforme.',
                'Le véhicule est assuré tous risques avec franchise conformément aux conditions du contrat souscrit.',
                'Le conducteur principal certifie être titulaire d’un permis de conduire valide depuis plus de 2 ans.',
                'La sous-location et le transport de passagers à titre onéreux non autorisé sont formellement prohibés.'
            ]
        };
    }
}
exports.ContractService = ContractService;
