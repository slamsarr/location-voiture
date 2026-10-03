import { randomBytes } from 'crypto';
import { prisma } from '../utils/prisma';

export class ContractService {
  /**
   * Génère ou récupère le contrat électronique d'une réservation
   */
  public static async generateContract(reservationId: string) {
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

    const year = new Date().getFullYear();
    const reference = `CTR-${year}-${randomBytes(4).toString('hex').toUpperCase()}`;
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
  public static async getContractDetails(reservationId: string) {
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
