"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const client_1 = require("@prisma/client");
const pricing_service_1 = require("../services/pricing.service");
const availability_service_1 = require("../services/availability.service");
const notification_service_1 = require("../services/notification.service");
const prisma = new client_1.PrismaClient();
class ReservationController {
    /**
     * Calcul dynamique du devis avant réservation
     */
    static async calculateQuote(req, res) {
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
            const durationDays = pricing_service_1.PricingService.calculateDurationDays(startDate, endDate);
            const isAvailable = await availability_service_1.AvailabilityService.isVehicleAvailable(vehicleId, startDate, endDate);
            const quote = pricing_service_1.PricingService.calculatePrice(vehicle.pricePerDay, vehicle.deposit, durationDays, options || [], pickupLocation, returnLocation);
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
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    /**
     * Création d'une nouvelle réservation
     */
    static async createReservation(req, res) {
        try {
            const dto = req.body;
            if (!dto.vehicleId || !dto.startDate || !dto.endDate || !dto.customer) {
                return res.status(400).json({ error: 'Champs obligatoires manquants.' });
            }
            // 1. Vérification de disponibilité
            const isAvailable = await availability_service_1.AvailabilityService.isVehicleAvailable(dto.vehicleId, dto.startDate, dto.endDate);
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
            const durationDays = pricing_service_1.PricingService.calculateDurationDays(dto.startDate, dto.endDate);
            const priceQuote = pricing_service_1.PricingService.calculatePrice(vehicle.pricePerDay, vehicle.deposit, durationDays, dto.options || [], dto.pickupLocation, dto.returnLocation);
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
            await notification_service_1.NotificationService.notifyBookingConfirmed(customer.email, customer.phone, reservation.reference, `${vehicle.brand} ${vehicle.model}`, reservation.totalAmount);
            return res.status(201).json(reservation);
        }
        catch (error) {
            console.error('Reservation creation error:', error);
            return res.status(500).json({ error: error.message });
        }
    }
    /**
     * Détail d'une réservation par ID ou Référence
     */
    static async getReservationById(req, res) {
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
            return res.json(reservation);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    /**
     * Réservations d'un client par email
     */
    static async getCustomerReservations(req, res) {
        try {
            const { email } = req.query;
            if (!email) {
                return res.status(400).json({ error: 'Email requis' });
            }
            const customer = await prisma.customer.findFirst({
                where: { email: String(email).toLowerCase() }
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
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.ReservationController = ReservationController;
