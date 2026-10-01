import { 
  Vehicle, 
  VehicleCategory, 
  Reservation, 
  DashboardStats, 
  BookingOption, 
  UserSession 
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Erreur HTTP ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Véhicules & Catégories
  getCategories: () => request<VehicleCategory[]>('/categories'),
  getVehicles: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString();
    return request<{ total: number; vehicles: Vehicle[] }>(`/vehicles${qs ? `?${qs}` : ''}`);
  },
  getVehicleById: (id: string) => request<Vehicle>(`/vehicles/${id}`),
  createVehicle: (data: Partial<Vehicle>) => request<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateVehicle: (id: string, data: Partial<Vehicle>) => request<Vehicle>(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteVehicle: (id: string) => request<{ message: string }>(`/vehicles/${id}`, {
    method: 'DELETE',
  }),

  // Réservations
  calculateQuote: (data: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    options: BookingOption[];
  }) => request<any>('/reservations/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createReservation: (data: any) => request<Reservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getReservationById: (id: string) => request<Reservation>(`/reservations/${id}`),
  getCustomerReservations: (email: string) => request<Reservation[]>(`/reservations/customer/history?email=${encodeURIComponent(email)}`),

  // Paiement
  initiatePayment: (data: {
    reservationId: string;
    method: string;
    customerPhone?: string;
    simulateStatus?: 'SUCCESS' | 'FAILED';
  }) => request<any>('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getPaymentByRef: (reference: string) => request<any>(`/payments/${reference}`),

  // Contrat
  getContractDetails: (reservationId: string) => request<any>(`/contracts/${reservationId}`),

  // Admin
  getDashboardStats: () => request<DashboardStats>('/dashboard/stats'),
  getAllReservations: (params: { status?: string; search?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return request<Reservation[]>(`/admin/reservations${query ? `?${query}` : ''}`);
  },
  updateReservationStatus: (id: string, status: string) => request<Reservation>(`/admin/reservations/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getAllCustomers: () => request<any[]>('/admin/customers'),
  getAllPayments: (status?: string) => request<any[]>(`/admin/payments${status ? `?status=${status}` : ''}`),
  getAllContracts: () => request<any[]>('/admin/contracts'),
  getInspections: () => request<any[]>('/admin/inspections'),
  createInspection: (data: any) => request<any>('/admin/inspections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getNotifications: () => request<any[]>('/admin/notifications'),

  // Auth
  login: (credentials: { email: string; password: string }) => request<{ token: string; user: UserSession }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  demoLogin: (role: 'ADMIN' | 'CLIENT') => request<{ token: string; user: UserSession }>('/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ role }),
  }),

  // AI Assistant
  queryClientAI: (query: string) => request<any>('/ai/client-query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  }),
  queryAdminAI: (query: string) => request<any>('/ai/admin-query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  }),
};
