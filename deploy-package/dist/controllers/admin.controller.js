"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const prisma_1 = require("../utils/prisma");
const isProduction = process.env.NODE_ENV === 'production';
function serverError(res, error) {
    console.error('[AdminController]', error);
    return res.status(500).json({
        error: isProduction ? 'Une erreur interne est survenue.' : error.message,
    });
}
class AdminController {
    /**
     * Tableau de bord : KPIs et séries temporelles pour Recharts
     */
    static async getDashboardStats(req, res) {
        try {
            const todayStr = '2026-03-15'; // Date de référence démonstration 2026
            const totalVehicles = await prisma_1.prisma.vehicle.count();
            const availableVehicles = await prisma_1.prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
            const rentedVehicles = await prisma_1.prisma.vehicle.count({ where: { status: 'RENTED' } });
            const maintenanceVehicles = await prisma_1.prisma.vehicle.count({ where: { status: 'MAINTENANCE' } });
            const totalReservations = await prisma_1.prisma.reservation.count();
            const todayReservations = 24; // KPI réaliste démonstration
            const monthReservations = 186; // KPI réaliste démonstration
            const successfulPayments = await prisma_1.prisma.payment.findMany({
                where: { status: 'SUCCESS' }
            });
            const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
            const pendingPaymentsCount = await prisma_1.prisma.payment.count({
                where: { status: 'PENDING' }
            });
            // Données pour les graphiques Recharts
            const revenueByMonth = [
                { month: 'Oct 2025', ca: 11200000, reservations: 130 },
                { month: 'Nov 2025', ca: 13450000, reservations: 145 },
                { month: 'Déc 2025', ca: 19800000, reservations: 210 },
                { month: 'Jan 2026', ca: 15200000, reservations: 160 },
                { month: 'Fév 2026', ca: 16100000, reservations: 172 },
                { month: 'Mar 2026', ca: 18450000, reservations: 186 },
            ];
            const reservationsByDay = [
                { day: 'Lun', bookings: 18, returns: 12 },
                { day: 'Mar', bookings: 22, returns: 16 },
                { day: 'Mer', bookings: 25, returns: 19 },
                { day: 'Jeu', bookings: 28, returns: 20 },
                { day: 'Ven', bookings: 38, returns: 24 },
                { day: 'Sam', bookings: 42, returns: 30 },
                { day: 'Dim', bookings: 24, returns: 35 },
            ];
            const paymentMethodsBreakdown = [
                { name: 'Wave', count: 48, percentage: 48, color: '#1dc4e9' },
                { name: 'Orange Money', count: 32, percentage: 32, color: '#ff6600' },
                { name: 'Carte Bancaire', count: 14, percentage: 14, color: '#3b82f6' },
                { name: 'InTouch', count: 6, percentage: 6, color: '#10b981' },
            ];
            const topVehicles = await prisma_1.prisma.vehicle.findMany({
                take: 5,
                include: {
                    category: true,
                    _count: { select: { reservations: true } }
                },
                orderBy: {
                    reservations: { _count: 'desc' }
                }
            });
            return res.json({
                kpis: {
                    todayReservations,
                    monthReservations,
                    totalReservations,
                    totalRevenue,
                    pendingPaymentsCount,
                    totalVehicles,
                    availableVehicles,
                    rentedVehicles,
                    maintenanceVehicles,
                    fleetUtilizationRate: Math.round(((totalVehicles - availableVehicles) / (totalVehicles || 1)) * 100)
                },
                charts: {
                    revenueByMonth,
                    reservationsByDay,
                    paymentMethodsBreakdown,
                    topVehicles: topVehicles.map(v => ({
                        name: `${v.brand} ${v.model}`,
                        category: v.category.name,
                        bookings: v._count.reservations,
                        revenue: v._count.reservations * v.pricePerDay * 4,
                        image: v.imageUrl
                    }))
                }
            });
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async getAllReservations(req, res) {
        try {
            const { status, search } = req.query;
            const where = {};
            if (status && status !== 'all') {
                where.status = String(status).toUpperCase();
            }
            if (search) {
                where.OR = [
                    { reference: { contains: String(search) } },
                    { customer: { firstName: { contains: String(search) } } },
                    { customer: { lastName: { contains: String(search) } } },
                    { customer: { email: { contains: String(search) } } },
                    { vehicle: { model: { contains: String(search) } } },
                ];
            }
            const reservations = await prisma_1.prisma.reservation.findMany({
                where,
                include: {
                    customer: true,
                    vehicle: { include: { category: true } },
                    payments: true,
                    contract: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(reservations);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async updateReservationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await prisma_1.prisma.reservation.update({
                where: { id },
                data: { status }
            });
            return res.json(updated);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async getAllCustomers(req, res) {
        try {
            const customers = await prisma_1.prisma.customer.findMany({
                include: {
                    reservations: {
                        select: {
                            id: true,
                            totalAmount: true,
                            createdAt: true,
                            status: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            const formatted = customers.map(c => {
                const totalSpent = c.reservations
                    .filter(r => r.status === 'PAID' || r.status === 'CONFIRMED' || r.status === 'COMPLETED')
                    .reduce((sum, r) => sum + r.totalAmount, 0);
                return {
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`,
                    email: c.email,
                    phone: c.phone,
                    licenseNumber: c.licenseNumber,
                    country: c.country,
                    reservationsCount: c.reservations.length,
                    totalSpent,
                    lastReservationDate: c.reservations[0]?.createdAt || null,
                    status: 'ACTIVE'
                };
            });
            return res.json(formatted);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async getAllPayments(req, res) {
        try {
            const { status } = req.query;
            const where = {};
            if (status && status !== 'all') {
                where.status = String(status).toUpperCase();
            }
            const payments = await prisma_1.prisma.payment.findMany({
                where,
                include: {
                    reservation: {
                        include: { customer: true, vehicle: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(payments);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async getAllContracts(req, res) {
        try {
            const contracts = await prisma_1.prisma.contract.findMany({
                include: {
                    reservation: {
                        include: {
                            customer: true,
                            vehicle: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(contracts);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    /**
     * État des Véhicules - Inspection V2
     */
    static async getInspections(req, res) {
        try {
            const inspections = await prisma_1.prisma.vehicleInspection.findMany({
                include: {
                    vehicle: true,
                    reservation: { include: { customer: true } }
                },
                orderBy: { completedAt: 'desc' }
            });
            return res.json(inspections);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async createInspection(req, res) {
        try {
            const data = req.body;
            const inspection = await prisma_1.prisma.vehicleInspection.create({
                data: {
                    vehicleId: data.vehicleId,
                    reservationId: data.reservationId || null,
                    type: data.type || 'CHECK_IN',
                    mileage: Number(data.mileage),
                    fuelLevel: Number(data.fuelLevel),
                    damages: typeof data.damages === 'string' ? data.damages : JSON.stringify(data.damages || []),
                    photos: typeof data.photos === 'string' ? data.photos : JSON.stringify(data.photos || []),
                    inspectorNotes: data.inspectorNotes || 'Inspection standard réalisée avec succès.',
                },
                include: { vehicle: true }
            });
            return res.status(201).json(inspection);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async getNotifications(req, res) {
        try {
            const notifications = await prisma_1.prisma.notification.findMany({
                take: 50,
                orderBy: { sentAt: 'desc' }
            });
            return res.json(notifications);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
}
exports.AdminController = AdminController;
