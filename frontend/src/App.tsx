import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClientLayout } from './layouts/ClientLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Client Pages
import { HomePage } from './pages/HomePage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentSimulationPage } from './pages/PaymentSimulationPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { ContractViewerPage } from './pages/ContractViewerPage';
import { CustomerReservationsPage } from './pages/CustomerReservationsPage';
import { LoginPage } from './pages/LoginPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminContractsPage } from './pages/admin/AdminContractsPage';
import { AdminInspectionV2Page } from './pages/admin/AdminInspectionV2Page';
import { AdminAIAssistantPage } from './pages/admin/AdminAIAssistantPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Public Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="vehicules" element={<VehiclesPage />} />
          <Route path="vehicules/:id" element={<VehicleDetailPage />} />
          <Route path="panier" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="paiement/:reservationId" element={<PaymentSimulationPage />} />
          <Route path="confirmation/:reservationId" element={<ConfirmationPage />} />
          <Route path="contrat/:reservationId" element={<ContractViewerPage />} />
          <Route path="mes-reservations" element={<CustomerReservationsPage />} />
          <Route path="connexion" element={<LoginPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Back-Office Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="vehicules" element={<AdminVehiclesPage />} />
          <Route path="clients" element={<AdminCustomersPage />} />
          <Route path="paiements" element={<AdminPaymentsPage />} />
          <Route path="contrats" element={<AdminContractsPage />} />
          <Route path="inspection-v2" element={<AdminInspectionV2Page />} />
          <Route path="ai-assistant" element={<AdminAIAssistantPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="parametres" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
