import { prisma } from '../utils/prisma';

export class AvailabilityService {
  /**
   * Vérifie si un véhicule donné est libre entre startDate et endDate (YYYY-MM-DD)
   * Une réservation bloque le véhicule si son statut est CONFIRMED, PAID, ou ACTIVE
   * et si les intervalles de dates se chevauchent.
   */
  public static async isVehicleAvailable(
    vehicleId: string,
    startDateStr: string,
    endDateStr: string,
    excludeReservationId?: string
  ): Promise<boolean> {
    // 1. Vérifier si le véhicule existe et n'est pas en maintenance
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle || vehicle.status === 'MAINTENANCE') {
      return false;
    }

    // 2. Chercher les réservations qui se chevauchent
    // Deux plages [A, B] et [C, D] se chevauchent si A <= D et B >= C
    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        vehicleId,
        id: excludeReservationId ? { not: excludeReservationId } : undefined,
        status: { in: ['CONFIRMED', 'PAID', 'ACTIVE', 'PENDING'] },
        AND: [
          { startDate: { lte: endDateStr } },
          { endDate: { gte: startDateStr } }
        ]
      }
    });

    return conflictingReservations.length === 0;
  }

  /**
   * Retourne la liste des IDs de véhicules disponibles sur une période donnée
   */
  public static async getAvailableVehicleIds(
    startDateStr: string,
    endDateStr: string
  ): Promise<string[]> {
    const allVehicles = await prisma.vehicle.findMany({
      where: {
        status: { not: 'MAINTENANCE' }
      },
      select: { id: true }
    });

    const availableIds: string[] = [];
    for (const v of allVehicles) {
      const isAvail = await this.isVehicleAvailable(v.id, startDateStr, endDateStr);
      if (isAvail) {
        availableIds.push(v.id);
      }
    }

    return availableIds;
  }
}
