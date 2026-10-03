import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { VehicleController } from '../controllers/vehicle.controller';
import { ReservationController } from '../controllers/reservation.controller';
import { PaymentController } from '../controllers/payment.controller';
import { ContractController } from '../controllers/contract.controller';
import { AdminController } from '../controllers/admin.controller';
import { AuthController } from '../controllers/auth.controller';
import { AIController } from '../controllers/ai.controller';
import {
  authMiddleware,
  adminOnlyMiddleware,
  clientOnlyMiddleware,
  validateBody,
} from '../utils/auth';
import {
  LoginSchema,
  RegisterSchema,
  DemoLoginSchema,
  QuoteSchema,
  CreateReservationSchema,
  UpdateReservationStatusSchema,
  InitiatePaymentSchema,
  CreateVehicleSchema,
  UpdateVehicleSchema,
  ClientAIQuerySchema,
  AdminAIQuerySchema,
  CreateInspectionSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  WebhookPaymentSchema,
} from '../utils/validation.schemas';

const router = Router();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

/** 10 tentatives par IP par 15 minutes sur les routes d'authentification */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

/** 30 créations de réservation par IP par heure */
const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de demandes de réservation. Réessayez plus tard.' },
});

// --- Auth & Profile Routes ---
router.post('/auth/login', authLimiter, validateBody(LoginSchema), AuthController.login);
router.post('/auth/register', authLimiter, validateBody(RegisterSchema), AuthController.register);
router.post('/auth/demo-login', authLimiter, validateBody(DemoLoginSchema), AuthController.demoLogin);
router.get('/auth/me', authMiddleware, AuthController.me);
router.get('/auth/profile', authMiddleware, AuthController.getProfile);
router.put('/auth/profile', authMiddleware, validateBody(UpdateProfileSchema), AuthController.updateProfile);
router.post('/auth/change-password', authMiddleware, validateBody(ChangePasswordSchema), AuthController.changePassword);

// --- Vehicles & Categories (lecture publique, écriture admin) ---
router.get('/categories', VehicleController.getCategories);
router.get('/vehicles', VehicleController.getVehicles);
router.get('/vehicles/:id', VehicleController.getVehicleById);
router.post('/vehicles', authMiddleware, adminOnlyMiddleware, validateBody(CreateVehicleSchema), VehicleController.createVehicle);
router.put('/vehicles/:id', authMiddleware, adminOnlyMiddleware, validateBody(UpdateVehicleSchema), VehicleController.updateVehicle);
router.delete('/vehicles/:id', authMiddleware, adminOnlyMiddleware, VehicleController.deleteVehicle);

// --- Reservations ---
router.post('/reservations/quote', validateBody(QuoteSchema), ReservationController.calculateQuote);
// authMiddleware requis + rate limiting pour créer une réservation
router.post('/reservations', authMiddleware, reservationLimiter, validateBody(CreateReservationSchema), ReservationController.createReservation);
router.get('/reservations/customer/history', authMiddleware, clientOnlyMiddleware, ReservationController.getCustomerReservations);
router.get('/reservations/:id', authMiddleware, ReservationController.getReservationById);

// --- Payments ---
router.post('/payments', authMiddleware, validateBody(InitiatePaymentSchema), PaymentController.initiatePayment);
router.get('/payments/:reference', authMiddleware, PaymentController.getPaymentByReference);
router.get('/payments/:reference/receipt', PaymentController.getPaymentReceipt);
router.post('/payments/webhook', validateBody(WebhookPaymentSchema), PaymentController.handleWebhook);

// --- Contracts ---
router.get('/contracts/:reservationId', authMiddleware, ContractController.getContractDetails);

// --- Admin Endpoints (TOUS protégés par JWT + rôle ADMIN) ---
router.get('/dashboard/stats', authMiddleware, adminOnlyMiddleware, AdminController.getDashboardStats);
router.get('/admin/reservations', authMiddleware, adminOnlyMiddleware, AdminController.getAllReservations);
router.put('/admin/reservations/:id/status', authMiddleware, adminOnlyMiddleware, validateBody(UpdateReservationStatusSchema), AdminController.updateReservationStatus);
router.get('/admin/customers', authMiddleware, adminOnlyMiddleware, AdminController.getAllCustomers);
router.get('/admin/payments', authMiddleware, adminOnlyMiddleware, AdminController.getAllPayments);
router.get('/admin/contracts', authMiddleware, adminOnlyMiddleware, AdminController.getAllContracts);
router.get('/admin/inspections', authMiddleware, adminOnlyMiddleware, AdminController.getInspections);
router.post('/admin/inspections', authMiddleware, adminOnlyMiddleware, validateBody(CreateInspectionSchema), AdminController.createInspection);
router.get('/admin/notifications', authMiddleware, adminOnlyMiddleware, AdminController.getNotifications);

// --- AI Assistant ---
router.post('/ai/client-query', validateBody(ClientAIQuerySchema), AIController.handleClientQuery);
router.post('/ai/admin-query', authMiddleware, adminOnlyMiddleware, validateBody(AdminAIQuerySchema), AIController.handleAdminQuery);

export default router;
