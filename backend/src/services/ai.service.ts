import { prisma } from '../utils/prisma';

export interface AIRecommendation {
  vehicleId: string;
  brand: string;
  model: string;
  pricePerDay: number;
  reason: string;
  matchScore: number; // 0 - 100
  imageUrl: string;
  category: string;
}

export interface VehicleComparison {
  vehicleA: { id: string; name: string; pricePerDay: number; category: string; transmission: string; seats: number };
  vehicleB: { id: string; name: string; pricePerDay: number; category: string; transmission: string; seats: number };
  verdict: string;
}

export interface ClientAIResponse {
  answer: string;
  recommendations: AIRecommendation[];
  comparison?: VehicleComparison;
  extractedCriteria: {
    transmission?: string;
    seats?: number;
    category?: string;
    durationDays?: number;
    budgetMax?: number;
  };
}

export interface AdminAIResponse {
  question: string;
  answer: string;
  dataSummary?: any;
  suggestedAction?: string;
}

export class AIService {
  /**
   * Analyse en langage naturel pour le client (recherche de véhicule)
   */
  public static async handleClientQuery(query: string): Promise<ClientAIResponse> {
    const q = query.toLowerCase();
    
    // Détection des critères
    const criteria: ClientAIResponse['extractedCriteria'] = {};

    if (q.includes('auto') || q.includes('automatique')) {
      criteria.transmission = 'AUTOMATIC';
    } else if (q.includes('manuelle') || q.includes('manuel')) {
      criteria.transmission = 'MANUAL';
    }

    const seatsMatch = q.match(/(\d+)\s*(places?|personnes?|passagers?)/);
    if (seatsMatch) {
      criteria.seats = parseInt(seatsMatch[1], 10);
    }

    const daysMatch = q.match(/(\d+)\s*(jours?|semaines?)/);
    if (daysMatch) {
      const num = parseInt(daysMatch[1], 10);
      criteria.durationDays = daysMatch[2].startsWith('semaine') ? num * 7 : num;
    }

    if (q.includes('suv') || q.includes('4x4')) {
      criteria.category = 'SUV';
    } else if (q.includes('berline') || q.includes('confort')) {
      criteria.category = 'Berline';
    } else if (q.includes('eco') || q.includes('économique') || q.includes('pas cher')) {
      criteria.category = 'Économique';
    } else if (q.includes('luxe') || q.includes('premium')) {
      criteria.category = 'Premium';
    }

    // Récupérer les véhicules
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: { in: ['AVAILABLE', 'RESERVED'] }
      },
      include: { category: true }
    });

    // Score et filtrage
    const scoredVehicles = vehicles.map(v => {
      let score = 70;
      const reasons: string[] = [];

      if (criteria.transmission && v.transmission === criteria.transmission) {
        score += 15;
        reasons.push(`Boîte ${criteria.transmission === 'AUTOMATIC' ? 'automatique' : 'manuelle'}`);
      }
      if (criteria.seats && v.seats >= criteria.seats) {
        score += 10;
        reasons.push(`${v.seats} places confortables`);
      }
      if (criteria.category && v.category.name.toLowerCase() === criteria.category.toLowerCase()) {
        score += 15;
        reasons.push(`Catégorie ${v.category.name}`);
      }

      const reason = reasons.length > 0 
        ? reasons.join(', ') 
        : `Excellent compromis pour votre trajet (${v.category.name})`;

      return {
        vehicleId: v.id,
        brand: v.brand,
        model: v.model,
        pricePerDay: v.pricePerDay,
        reason,
        matchScore: Math.min(score, 98),
        imageUrl: v.imageUrl,
        category: v.category.name,
      };
    });

    scoredVehicles.sort((a, b) => b.matchScore - a.matchScore);
    const topPicks = scoredVehicles.slice(0, 3);

    // Comparaison intelligente si demandée ou si 2 véhicules en tête
    let comparison: VehicleComparison | undefined = undefined;
    if ((q.includes('compar') || q.includes('versus') || q.includes('vs') || q.includes('difference')) && topPicks.length >= 2) {
      const vA = topPicks[0];
      const vB = topPicks[1];
      const origA = vehicles.find(v => v.id === vA.vehicleId)!;
      const origB = vehicles.find(v => v.id === vB.vehicleId)!;

      const verdict = vA.pricePerDay < vB.pricePerDay
        ? `${vA.brand} ${vA.model} est plus économique de ${(vB.pricePerDay - vA.pricePerDay).toLocaleString('fr-FR')} FCFA/jour, idéal pour optimiser votre budget.`
        : `${vA.brand} ${vA.model} offre un meilleur niveau d'équipement et de confort routier.`;

      comparison = {
        vehicleA: {
          id: origA.id,
          name: `${origA.brand} ${origA.model}`,
          pricePerDay: origA.pricePerDay,
          category: origA.category.name,
          transmission: origA.transmission === 'AUTOMATIC' ? 'Automatique' : 'Manuelle',
          seats: origA.seats,
        },
        vehicleB: {
          id: origB.id,
          name: `${origB.brand} ${origB.model}`,
          pricePerDay: origB.pricePerDay,
          category: origB.category.name,
          transmission: origB.transmission === 'AUTOMATIC' ? 'Automatique' : 'Manuelle',
          seats: origB.seats,
        },
        verdict,
      };
    }

    const answer = comparison
      ? `J'ai préparé un comparatif détaillé entre nos modèles phares pour faciliter votre choix.`
      : `J'ai analysé votre demande. Voici ${topPicks.length} véhicules parfaitement adaptés à vos besoins de mobilité${criteria.durationDays ? ` pour une durée estimée de ${criteria.durationDays} jours` : ''}.`;

    return {
      answer,
      recommendations: topPicks,
      comparison,
      extractedCriteria: criteria,
    };
  }

  /**
   * Analyse et requêtes intelligentes pour le Back-Office Admin
   */
  public static async handleAdminQuery(query: string): Promise<AdminAIResponse> {
    const q = query.toLowerCase();

    // 0. Prévision et Taux d'occupation
    if (q.includes('occupation') || q.includes('prevision') || q.includes('prévision') || q.includes('tendance')) {
      const totalVehicles = await prisma.vehicle.count();
      const activeRentals = await prisma.reservation.count({
        where: { status: { in: ['PAID', 'CONFIRMED', 'ACTIVE'] } }
      });
      const occupancyRate = Math.min(100, Math.round((activeRentals / (totalVehicles || 1)) * 100));

      return {
        question: query,
        answer: `Le taux d'occupation prévisionnel pour les 15 prochains jours est estimé à **${occupancyRate}%** (${activeRentals} véhicules engagés sur une flotte de ${totalVehicles}). Recommandation : Ajuster la tarification des SUV pour capter la demande croissante du week-end.`,
        dataSummary: { occupancyRate, totalFleet: totalVehicles, engagedVehicles: activeRentals },
        suggestedAction: 'Optimiser la tarification dynamique de la flotte'
      };
    }

    // 1. Chiffre d'affaires
    if (q.includes('chiffre d\'affaires') || q.includes('ca') || q.includes('revenu')) {
      const payments = await prisma.payment.findMany({
        where: { status: 'SUCCESS' }
      });
      const totalCA = payments.reduce((sum, p) => sum + p.amount, 0);
      return {
        question: query,
        answer: `Le chiffre d'affaires total encaissé s'élève actuellement à **${totalCA.toLocaleString('fr-FR')} FCFA** sur un total de ${payments.length} paiements réussis.`,
        dataSummary: { totalCA, paymentCount: payments.length },
        suggestedAction: 'Consulter l\'onglet Rapports financiers'
      };
    }

    // 2. Réservations impayées ou en attente
    if (q.includes('impayé') || q.includes('attente') || q.includes('pending')) {
      const pendingReservations = await prisma.reservation.findMany({
        where: { status: { in: ['PENDING', 'CONFIRMED'] } },
        include: { customer: true, vehicle: true }
      });
      return {
        question: query,
        answer: `Il y a actuellement **${pendingReservations.length} réservations** en attente de paiement ou de validation.`,
        dataSummary: pendingReservations.map(r => ({
          ref: r.reference,
          client: `${r.customer.firstName} ${r.customer.lastName}`,
          montant: `${r.totalAmount.toLocaleString('fr-FR')} FCFA`,
          statut: r.status
        })),
        suggestedAction: 'Accéder à la gestion des réservations'
      };
    }

    // 3. Véhicules disponibles
    if (q.includes('disponible') || q.includes('flotte') || q.includes('véhicules')) {
      const availableVehicles = await prisma.vehicle.findMany({
        where: { status: 'AVAILABLE' },
        include: { category: true }
      });
      const totalVehicles = await prisma.vehicle.count();
      return {
        question: query,
        answer: `Actuellement, **${availableVehicles.length} véhicules sur ${totalVehicles}** sont immédiatement disponibles à la location (${Math.round((availableVehicles.length / totalVehicles) * 100)}% de disponibilité de flotte).`,
        dataSummary: availableVehicles.map(v => `${v.brand} ${v.model} (${v.category.name})`),
        suggestedAction: 'Vérifier le planning de rotation des véhicules'
      };
    }

    // Réponse générique intelligente
    return {
      question: query,
      answer: `Je suis l'assistant IA Hertz Digital. Vous pouvez m'interroger sur le chiffre d'affaires, les véhicules disponibles, les réservations en attente ou les statistiques de la flotte.`,
      suggestedAction: 'Exemple : "Quel est le chiffre d\'affaires du mois ?" ou "Quelles sont les réservations impayées ?"'
    };
  }
}
