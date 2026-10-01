"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_controller_1 = require("../controllers/vehicle.controller");
const reservation_controller_1 = require("../controllers/reservation.controller");
const payment_controller_1 = require("../controllers/payment.controller");
const contract_controller_1 = require("../controllers/contract.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
// --- Auth Routes ---
router.post('/auth/login', auth_controller_1.AuthController.login);
router.post('/auth/register', auth_controller_1.AuthController.register);
router.post('/auth/demo-login', auth_controller_1.AuthController.demoLogin);
// --- Vehicles & Categories ---
router.get('/categories', vehicle_controller_1.VehicleController.getCategories);
router.get('/vehicles', vehicle_controller_1.VehicleController.getVehicles);
router.get('/vehicles/:id', vehicle_controller_1.VehicleController.getVehicleById);
router.post('/vehicles', vehicle_controller_1.VehicleController.createVehicle);
router.put('/vehicles/:id', vehicle_controller_1.VehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicle_controller_1.VehicleController.deleteVehicle);
// --- Reservations ---
router.post('/reservations/quote', reservation_controller_1.ReservationController.calculateQuote);
router.post('/reservations', reservation_controller_1.ReservationController.createReservation);
router.get('/reservations/customer/history', reservation_controller_1.ReservationController.getCustomerReservations);
router.get('/reservations/:id', reservation_controller_1.ReservationController.getReservationById);
// --- Payments ---
router.post('/payments', payment_controller_1.PaymentController.initiatePayment);
router.get('/payments/:reference', payment_controller_1.PaymentController.getPaymentByReference);
// --- Contracts ---
router.get('/contracts/:reservationId', contract_controller_1.ContractController.getContractDetails);
// --- Admin Endpoints ---
router.get('/dashboard/stats', admin_controller_1.AdminController.getDashboardStats);
router.get('/admin/reservations', admin_controller_1.AdminController.getAllReservations);
router.put('/admin/reservations/:id/status', admin_controller_1.AdminController.updateReservationStatus);
router.get('/admin/customers', admin_controller_1.AdminController.getAllCustomers);
router.get('/admin/payments', admin_controller_1.AdminController.getAllPayments);
router.get('/admin/contracts', admin_controller_1.AdminController.getAllContracts);
router.get('/admin/inspections', admin_controller_1.AdminController.getInspections);
router.post('/admin/inspections', admin_controller_1.AdminController.createInspection);
router.get('/admin/notifications', admin_controller_1.AdminController.getNotifications);
// --- AI Assistant ---
router.post('/ai/client-query', ai_controller_1.AIController.handleClientQuery);
router.post('/ai/admin-query', ai_controller_1.AIController.handleAdminQuery);
exports.default = router;
