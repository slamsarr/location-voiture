"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookPaymentSchema = exports.ChangePasswordSchema = exports.UpdateProfileSchema = exports.CreateInspectionSchema = exports.AdminAIQuerySchema = exports.ClientAIQuerySchema = exports.UpdateVehicleSchema = exports.CreateVehicleSchema = exports.InitiatePaymentSchema = exports.UpdateReservationStatusSchema = exports.CreateReservationSchema = exports.QuoteSchema = exports.DemoLoginSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Format email invalide').min(3).max(255),
    password: zod_1.z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').max(255),
});
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nom invalide').max(255),
    email: zod_1.z.string().email('Format email invalide').min(3).max(255),
    password: zod_1.z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(255)
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    phone: zod_1.z.string().optional().or(zod_1.z.string().max(50)),
});
exports.DemoLoginSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'CLIENT'], { required_error: 'Le rôle est requis (ADMIN | CLIENT)' }),
});
exports.QuoteSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().uuid('ID véhicule invalide'),
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de début invalide (YYYY-MM-DD)'),
    endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de fin invalide (YYYY-MM-DD)'),
    pickupLocation: zod_1.z.string().optional().or(zod_1.z.string().max(255)),
    returnLocation: zod_1.z.string().optional().or(zod_1.z.string().max(255)),
    options: zod_1.z.array(zod_1.z.object({
        code: zod_1.z.string().max(50),
        name: zod_1.z.string().max(255),
        pricePerDay: zod_1.z.number().min(0),
        quantity: zod_1.z.number().int().min(1).optional(),
    })).optional(),
});
exports.CreateReservationSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().uuid('ID véhicule invalide'),
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de début invalide (YYYY-MM-DD)'),
    endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de fin invalide (YYYY-MM-DD)'),
    pickupTime: zod_1.z.string().optional().or(zod_1.z.string().regex(/^\d{2}:\d{2}$/)),
    returnTime: zod_1.z.string().optional().or(zod_1.z.string().regex(/^\d{2}:\d{2}$/)),
    pickupLocation: zod_1.z.string().max(255),
    returnLocation: zod_1.z.string().max(255),
    customer: zod_1.z.object({
        firstName: zod_1.z.string().min(2).max(255),
        lastName: zod_1.z.string().min(2).max(255),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(6).max(50),
        licenseNumber: zod_1.z.string().min(4).max(100),
        licenseExpiry: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        licenseCountry: zod_1.z.string().optional().or(zod_1.z.string().max(100)),
        address: zod_1.z.string().optional().or(zod_1.z.string().max(500)),
        city: zod_1.z.string().optional().or(zod_1.z.string().max(255)),
        country: zod_1.z.string().optional().or(zod_1.z.string().max(255)),
        userId: zod_1.z.string().uuid().optional(),
    }),
    options: zod_1.z.array(zod_1.z.object({
        code: zod_1.z.string().max(50),
        name: zod_1.z.string().max(255),
        pricePerDay: zod_1.z.number().min(0),
        quantity: zod_1.z.number().int().min(1).optional(),
    })).optional(),
});
exports.UpdateReservationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED'], {
        required_error: 'Statut invalide',
    }),
});
exports.InitiatePaymentSchema = zod_1.z.object({
    reservationId: zod_1.z.string().uuid('ID réservation invalide'),
    amount: zod_1.z.number().min(0, 'Le montant ne peut pas être négatif').optional(),
    method: zod_1.z.enum(['WAVE', 'ORANGE_MONEY', 'INTOUCH', 'CARD'], {
        required_error: 'Méthode de paiement invalide',
    }),
    phone: zod_1.z.string().optional().or(zod_1.z.string().max(50)),
    customerPhone: zod_1.z.string().optional().or(zod_1.z.string().max(50)),
    simulateStatus: zod_1.z.enum(['SUCCESS', 'FAILED']).optional(),
});
exports.CreateVehicleSchema = zod_1.z.object({
    brand: zod_1.z.string().min(1).max(100),
    model: zod_1.z.string().min(1).max(100),
    year: zod_1.z.number().int().min(1990).max(new Date().getFullYear() + 1),
    categoryId: zod_1.z.string().uuid('ID catégorie invalide'),
    transmission: zod_1.z.enum(['MANUAL', 'AUTOMATIC']).optional(),
    fuel: zod_1.z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC']).optional(),
    seats: zod_1.z.number().int().min(1).max(20).optional(),
    doors: zod_1.z.number().int().min(1).max(10).optional(),
    airConditioning: zod_1.z.boolean().optional(),
    pricePerDay: zod_1.z.number().min(0),
    deposit: zod_1.z.number().min(0),
    mileagePolicy: zod_1.z.string().max(255).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE']).optional(),
    imageUrl: zod_1.z.string().url('URL image invalide').max(2000),
    gallery: zod_1.z.string().optional(),
    description: zod_1.z.string().min(10).max(5000),
    features: zod_1.z.string().optional(),
    plateNumber: zod_1.z.string().min(3).max(50),
});
exports.UpdateVehicleSchema = exports.CreateVehicleSchema.partial();
exports.ClientAIQuerySchema = zod_1.z.object({
    query: zod_1.z.string().min(2, 'La requête est trop courte').max(2000, 'Requête trop longue'),
    context: zod_1.z.object({
        pickupLocation: zod_1.z.string().optional(),
        dates: zod_1.z.object({ start: zod_1.z.string().optional(), end: zod_1.z.string().optional() }).optional(),
    }).optional(),
});
exports.AdminAIQuerySchema = zod_1.z.object({
    query: zod_1.z.string().min(2, 'La requête est trop courte').max(3000),
});
exports.CreateInspectionSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().uuid('ID véhicule invalide'),
    reservationId: zod_1.z.string().uuid().optional(),
    type: zod_1.z.enum(['CHECK_IN', 'CHECK_OUT'], { required_error: 'Type d’inspection invalide' }),
    mileage: zod_1.z.number().int().min(0),
    fuelLevel: zod_1.z.number().int().min(0).max(100, 'Niveau carburant : 0-100 %'),
    damages: zod_1.z.string().optional(),
    photos: zod_1.z.string().optional(),
    inspectorNotes: zod_1.z.string().optional().or(zod_1.z.string().max(5000)),
});
exports.UpdateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255).optional(),
    phone: zod_1.z.string().min(6, 'Numéro de téléphone invalide').max(50).optional(),
    address: zod_1.z.string().max(500).optional(),
    city: zod_1.z.string().max(255).optional(),
    country: zod_1.z.string().max(255).optional(),
    licenseNumber: zod_1.z.string().min(3).max(100).optional(),
    licenseExpiry: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date d’expiration invalide (YYYY-MM-DD)').optional(),
    licenseCountry: zod_1.z.string().max(100).optional(),
    licensePhotoUrl: zod_1.z.string().max(5000000).optional(), // supporte base64 ou URL
});
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: zod_1.z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});
exports.WebhookPaymentSchema = zod_1.z.object({
    event: zod_1.z.string(),
    reference: zod_1.z.string(),
    status: zod_1.z.enum(['SUCCESS', 'FAILED', 'PENDING']),
    amount: zod_1.z.number().optional(),
    method: zod_1.z.string().optional(),
    signature: zod_1.z.string().optional(),
});
