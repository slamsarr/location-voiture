"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const client_1 = require("@prisma/client");
const availability_service_1 = require("../services/availability.service");
const prisma = new client_1.PrismaClient();
class VehicleController {
    static async getCategories(req, res) {
        try {
            const categories = await prisma.vehicleCategory.findMany({
                include: {
                    _count: { select: { vehicles: true } }
                }
            });
            return res.json(categories);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async getVehicles(req, res) {
        try {
            const { startDate, endDate, categoryId, category, transmission, fuel, minSeats, maxPrice, sort, } = req.query;
            const where = {};
            if (categoryId) {
                where.categoryId = String(categoryId);
            }
            else if (category && category !== 'all') {
                const cat = await prisma.vehicleCategory.findFirst({
                    where: {
                        OR: [
                            { slug: String(category).toLowerCase() },
                            { name: { equals: String(category) } }
                        ]
                    }
                });
                if (cat) {
                    where.categoryId = cat.id;
                }
            }
            if (transmission && transmission !== 'all') {
                where.transmission = String(transmission).toUpperCase();
            }
            if (fuel && fuel !== 'all') {
                where.fuel = String(fuel).toUpperCase();
            }
            if (minSeats) {
                where.seats = { gte: Number(minSeats) };
            }
            if (maxPrice) {
                where.pricePerDay = { lte: Number(maxPrice) };
            }
            // Si dates fournies, filtrer par disponibilité réelle
            if (startDate && endDate) {
                const availableIds = await availability_service_1.AvailabilityService.getAvailableVehicleIds(String(startDate), String(endDate));
                where.id = { in: availableIds };
            }
            let orderBy = { pricePerDay: 'asc' };
            if (sort === 'price_desc') {
                orderBy = { pricePerDay: 'desc' };
            }
            else if (sort === 'popularity') {
                orderBy = { year: 'desc' };
            }
            const vehicles = await prisma.vehicle.findMany({
                where,
                include: { category: true },
                orderBy,
            });
            return res.json({
                total: vehicles.length,
                vehicles,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async getVehicleById(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await prisma.vehicle.findUnique({
                where: { id },
                include: { category: true }
            });
            if (!vehicle) {
                return res.status(404).json({ error: 'Véhicule introuvable.' });
            }
            return res.json(vehicle);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createVehicle(req, res) {
        try {
            const data = req.body;
            const vehicle = await prisma.vehicle.create({
                data: {
                    brand: data.brand,
                    model: data.model,
                    year: Number(data.year),
                    categoryId: data.categoryId,
                    transmission: data.transmission || 'MANUAL',
                    fuel: data.fuel || 'DIESEL',
                    seats: Number(data.seats || 5),
                    doors: Number(data.doors || 5),
                    airConditioning: Boolean(data.airConditioning ?? true),
                    pricePerDay: Number(data.pricePerDay),
                    deposit: Number(data.deposit),
                    mileagePolicy: data.mileagePolicy || 'Kilométrage illimité',
                    status: data.status || 'AVAILABLE',
                    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
                    description: data.description,
                    features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
                    plateNumber: data.plateNumber || `DK-${Math.floor(1000 + Math.random() * 9000)}-HZ`,
                }
            });
            return res.status(201).json(vehicle);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async updateVehicle(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const vehicle = await prisma.vehicle.update({
                where: { id },
                data: {
                    brand: data.brand,
                    model: data.model,
                    year: data.year ? Number(data.year) : undefined,
                    categoryId: data.categoryId,
                    transmission: data.transmission,
                    fuel: data.fuel,
                    seats: data.seats ? Number(data.seats) : undefined,
                    doors: data.doors ? Number(data.doors) : undefined,
                    airConditioning: data.airConditioning !== undefined ? Boolean(data.airConditioning) : undefined,
                    pricePerDay: data.pricePerDay ? Number(data.pricePerDay) : undefined,
                    deposit: data.deposit ? Number(data.deposit) : undefined,
                    status: data.status,
                    imageUrl: data.imageUrl,
                    description: data.description,
                }
            });
            return res.json(vehicle);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async deleteVehicle(req, res) {
        try {
            const { id } = req.params;
            await prisma.vehicle.delete({
                where: { id }
            });
            return res.json({ message: 'Véhicule supprimé avec succès' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.VehicleController = VehicleController;
