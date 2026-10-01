import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { ReservationController } from '../controllers/reservation.controller';
import { PaymentController } from '../controllers/payment.controller';
import { ContractController } from '../controllers/contract.controller';
import { AdminController } from '../controllers/admin.controller';
import { AuthController } from '../controllers/auth.controller';
import { AIController } from '../controllers/ai.controller';

const router = Router();

// --- Auth Routes ---
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/demo-login', AuthController.demoLogin);

// --- Vehicles & Categories ---
router.get('/categories', VehicleController.getCategories);
router.get('/vehicles', VehicleController.getVehicles);
router.get('/vehicles/:id', VehicleController.getVehicleById);
router.post('/vehicles', VehicleController.createVehicle);
router.put('/vehicles/:id', VehicleController.updateVehicle);
router.delete('/vehicles/:id', VehicleController.deleteVehicle);

// --- Reservations ---
router.post('/reservations/quote', ReservationController.calculateQuote);
router.post('/reservations', ReservationController.createReservation);
router.get('/reservations/customer/history', ReservationController.getCustomerReservations);
router.get('/reservations/:id', ReservationController.getReservationById);

// --- Payments ---
router.post('/payments', PaymentController.initiatePayment);
router.get('/payments/:reference', PaymentController.getPaymentByReference);

// --- Contracts ---
router.get('/contracts/:reservationId', ContractController.getContractDetails);

// --- Admin Endpoints ---
router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/admin/reservations', AdminController.getAllReservations);
router.put('/admin/reservations/:id/status', AdminController.updateReservationStatus);
router.get('/admin/customers', AdminController.getAllCustomers);
router.get('/admin/payments', AdminController.getAllPayments);
router.get('/admin/contracts', AdminController.getAllContracts);
router.get('/admin/inspections', AdminController.getInspections);
router.post('/admin/inspections', AdminController.createInspection);
router.get('/admin/notifications', AdminController.getNotifications);

// --- AI Assistant ---
router.post('/ai/client-query', AIController.handleClientQuery);
router.post('/ai/admin-query', AIController.handleAdminQuery);

export default router;
