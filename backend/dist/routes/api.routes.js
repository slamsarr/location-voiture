"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const vehicle_controller_1 = require("../controllers/vehicle.controller");
const reservation_controller_1 = require("../controllers/reservation.controller");
const payment_controller_1 = require("../controllers/payment.controller");
const contract_controller_1 = require("../controllers/contract.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_1 = require("../utils/auth");
const validation_schemas_1 = require("../utils/validation.schemas");
const router = (0, express_1.Router)();
// ─── Rate Limiters ────────────────────────────────────────────────────────────
/** 10 tentatives par IP par 15 minutes sur les routes d'authentification */
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});
/** 30 créations de réservation par IP par heure */
const reservationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de demandes de réservation. Réessayez plus tard.' },
});
// --- Auth & Profile Routes ---
router.post('/auth/login', authLimiter, (0, auth_1.validateBody)(validation_schemas_1.LoginSchema), auth_controller_1.AuthController.login);
router.post('/auth/register', authLimiter, (0, auth_1.validateBody)(validation_schemas_1.RegisterSchema), auth_controller_1.AuthController.register);
router.post('/auth/demo-login', authLimiter, (0, auth_1.validateBody)(validation_schemas_1.DemoLoginSchema), auth_controller_1.AuthController.demoLogin);
router.get('/auth/me', auth_1.authMiddleware, auth_controller_1.AuthController.me);
router.get('/auth/profile', auth_1.authMiddleware, auth_controller_1.AuthController.getProfile);
router.put('/auth/profile', auth_1.authMiddleware, (0, auth_1.validateBody)(validation_schemas_1.UpdateProfileSchema), auth_controller_1.AuthController.updateProfile);
router.post('/auth/change-password', auth_1.authMiddleware, (0, auth_1.validateBody)(validation_schemas_1.ChangePasswordSchema), auth_controller_1.AuthController.changePassword);
// --- Vehicles & Categories (lecture publique, écriture admin) ---
router.get('/categories', vehicle_controller_1.VehicleController.getCategories);
router.get('/vehicles', vehicle_controller_1.VehicleController.getVehicles);
router.get('/vehicles/:id', vehicle_controller_1.VehicleController.getVehicleById);
router.post('/vehicles', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, (0, auth_1.validateBody)(validation_schemas_1.CreateVehicleSchema), vehicle_controller_1.VehicleController.createVehicle);
router.put('/vehicles/:id', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, (0, auth_1.validateBody)(validation_schemas_1.UpdateVehicleSchema), vehicle_controller_1.VehicleController.updateVehicle);
router.delete('/vehicles/:id', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, vehicle_controller_1.VehicleController.deleteVehicle);
// --- Reservations ---
router.post('/reservations/quote', (0, auth_1.validateBody)(validation_schemas_1.QuoteSchema), reservation_controller_1.ReservationController.calculateQuote);
// authMiddleware requis + rate limiting pour créer une réservation
router.post('/reservations', auth_1.authMiddleware, reservationLimiter, (0, auth_1.validateBody)(validation_schemas_1.CreateReservationSchema), reservation_controller_1.ReservationController.createReservation);
router.get('/reservations/customer/history', auth_1.authMiddleware, auth_1.clientOnlyMiddleware, reservation_controller_1.ReservationController.getCustomerReservations);
router.get('/reservations/:id', auth_1.authMiddleware, reservation_controller_1.ReservationController.getReservationById);
// --- Payments ---
router.post('/payments', auth_1.authMiddleware, (0, auth_1.validateBody)(validation_schemas_1.InitiatePaymentSchema), payment_controller_1.PaymentController.initiatePayment);
router.get('/payments/:reference', auth_1.authMiddleware, payment_controller_1.PaymentController.getPaymentByReference);
router.get('/payments/:reference/receipt', payment_controller_1.PaymentController.getPaymentReceipt);
router.post('/payments/webhook', (0, auth_1.validateBody)(validation_schemas_1.WebhookPaymentSchema), payment_controller_1.PaymentController.handleWebhook);
// --- Contracts ---
router.get('/contracts/:reservationId', auth_1.authMiddleware, contract_controller_1.ContractController.getContractDetails);
// --- Admin Endpoints (TOUS protégés par JWT + rôle ADMIN) ---
router.get('/dashboard/stats', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getDashboardStats);
router.get('/admin/reservations', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getAllReservations);
router.put('/admin/reservations/:id/status', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, (0, auth_1.validateBody)(validation_schemas_1.UpdateReservationStatusSchema), admin_controller_1.AdminController.updateReservationStatus);
router.get('/admin/customers', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getAllCustomers);
router.get('/admin/payments', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getAllPayments);
router.get('/admin/contracts', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getAllContracts);
router.get('/admin/inspections', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getInspections);
router.post('/admin/inspections', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, (0, auth_1.validateBody)(validation_schemas_1.CreateInspectionSchema), admin_controller_1.AdminController.createInspection);
router.get('/admin/notifications', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, admin_controller_1.AdminController.getNotifications);
// --- AI Assistant ---
router.post('/ai/client-query', (0, auth_1.validateBody)(validation_schemas_1.ClientAIQuerySchema), ai_controller_1.AIController.handleClientQuery);
router.post('/ai/admin-query', auth_1.authMiddleware, auth_1.adminOnlyMiddleware, (0, auth_1.validateBody)(validation_schemas_1.AdminAIQuerySchema), ai_controller_1.AIController.handleAdminQuery);
exports.default = router;
