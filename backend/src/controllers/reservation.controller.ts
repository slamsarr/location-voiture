import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PricingService } from '../services/pricing.service';
import { AvailabilityService } from '../services/availability.service';
import { NotificationService } from '../services/notification.service';
import { CreateReservationDto } from '../types';
import { AuthRequest } from '../utils/auth';

const prisma = new PrismaClient();

export class ReservationController {
  /**
   * Calcul dynamique du devis avant réservation
   */
  public static async calculateQuote(req: Request, res: Response) {
    try {
      const { vehicleId, startDate, endDate, options, pickupLocation, returnLocation } = req.body;

      if (!vehicleId || !startDate || !endDate) {
        return res.status(400).json({ error: 'vehicleId, startDate et endDate sont requis.' });
      }

      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId }
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule introuvable.' });
      }

      const durationDays = PricingService.calculateDurationDays(startDate, endDate);
      const isAvailable = await AvailabilityService.isVehicleAvailable(vehicleId, startDate, endDate);

      const quote = PricingService.calculatePrice(
        vehicle.pricePerDay,
        vehicle.deposit,
        durationDays,
        options || [],
        pickupLocation,
        returnLocation
      );

      return res.json({
        ...quote,
        isAvailable,
        vehicle: {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          pricePerDay: vehicle.pricePerDay,
          deposit: vehicle.deposit
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Création d'une nouvelle réservation
   */
  public static async createReservation(req: Request, res: Response) {
    try {
      const dto: CreateReservationDto = req.body;

      if (!dto.vehicleId || !dto.startDate || !dto.endDate || !dto.customer) {
        return res.status(400).json({ error: 'Champs obligatoires manquants.' });
      }

      // 1. Vérification de disponibilité
      const isAvailable = await AvailabilityService.isVehicleAvailable(
        dto.vehicleId,
        dto.startDate,
        dto.endDate
      );

      if (!isAvailable) {
        return res.status(409).json({ 
          error: 'Désolé, ce véhicule n’est plus disponible aux dates sélectionnées.' 
        });
      }

      const vehicle = await prisma.vehicle.findUnique({
        where: { id: dto.vehicleId }
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule introuvable.' });
      }

      // 2. Calcul du prix
      const durationDays = PricingService.calculateDurationDays(dto.startDate, dto.endDate);
      const priceQuote = PricingService.calculatePrice(
        vehicle.pricePerDay,
        vehicle.deposit,
        durationDays,
        dto.options || [],
        dto.pickupLocation,
        dto.returnLocation
      );

      // 3. Création ou mise à jour du client
      let customer = await prisma.customer.findFirst({
        where: { email: dto.customer.email.toLowerCase() }
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            firstName: dto.customer.firstName,
            lastName: dto.customer.lastName,
            email: dto.customer.email.toLowerCase(),
            phone: dto.customer.phone,
            licenseNumber: dto.customer.licenseNumber,
            licenseExpiry: dto.customer.licenseExpiry,
            licenseCountry: dto.customer.licenseCountry || 'Sénégal',
            address: dto.customer.address || '',
            city: dto.customer.city || 'Dakar',
            country: dto.customer.country || 'Sénégal'
          }
        });
      }

      // 4. Générer la référence unique HZ-2026-XXXXXX
      const reference = `HZ-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      // 5. Créer la réservation
      const reservation = await prisma.reservation.create({
        data: {
          reference,
          customerId: customer.id,
          vehicleId: vehicle.id,
          startDate: dto.startDate,
          endDate: dto.endDate,
          pickupTime: dto.pickupTime || '10:00',
          returnTime: dto.returnTime || '10:00',
          pickupLocation: dto.pickupLocation || 'Agence Aéroport Blaise Diagne (AIBD)',
          returnLocation: dto.returnLocation || 'Agence Aéroport Blaise Diagne (AIBD)',
          dailyRate: vehicle.pricePerDay,
          durationDays,
          subtotal: priceQuote.subtotal,
          optionsTotal: priceQuote.optionsTotal,
          taxTotal: priceQuote.taxTotal,
          totalAmount: priceQuote.totalAmount,
          depositAmount: priceQuote.depositAmount,
          status: 'PENDING',
          options: {
            create: (dto.options || []).map(opt => ({
              code: opt.code,
              name: opt.name,
              pricePerDay: opt.pricePerDay,
              quantity: opt.quantity || 1,
              totalPrice: opt.pricePerDay * durationDays * (opt.quantity || 1)
            }))
          }
        },
        include: {
          customer: true,
          vehicle: { include: { category: true } },
          options: true
        }
      });

      // 6. Notification asynchrone
      await NotificationService.notifyBookingConfirmed(
        customer.email,
        customer.phone,
        reservation.reference,
        `${vehicle.brand} ${vehicle.model}`,
        reservation.totalAmount
      );

      return res.status(201).json(reservation);
    } catch (error: any) {
      console.error('Reservation creation error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Détail d'une réservation par ID ou Référence
   */
  public static async getReservationById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const reservation = await prisma.reservation.findFirst({
        where: {
          OR: [
            { id },
            { reference: id }
          ]
        },
        include: {
          customer: true,
          vehicle: { include: { category: true } },
          options: true,
          payments: true,
          contract: true
        }
      });

      if (!reservation) {
        return res.status(404).json({ error: 'Réservation introuvable.' });
      }

      if (req.user && req.user.role !== 'ADMIN') {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user || user.email !== reservation.customer.email) {
          return res.status(403).json({ error: 'Accès refusé. Cette réservation ne vous appartient pas.' });
        }
      }

      return res.json(reservation);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getCustomerReservations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise.' });
      }

      let customerEmail: string | null = null;

      if (req.user.role === 'ADMIN') {
        const emailParam = req.query.email as string | undefined;
        if (emailParam) {
          customerEmail = emailParam.toLowerCase();
        }
      }

      if (!customerEmail) {
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { email: true }
        });
        if (!user) {
          return res.status(404).json({ error: 'Utilisateur introuvable.' });
        }
        customerEmail = user.email;
      }

      const customer = await prisma.customer.findFirst({
        where: { email: customerEmail.toLowerCase() }
      });

      if (!customer) {
        return res.json([]);
      }

      const reservations = await prisma.reservation.findMany({
        where: { customerId: customer.id },
        include: {
          vehicle: { include: { category: true } },
          payments: true,
          contract: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(reservations);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
