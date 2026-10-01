import { 
  Vehicle, 
  VehicleCategory, 
  Reservation, 
  DashboardStats, 
  BookingOption, 
  UserSession 
} from '../types';

const API_BASE = '/api';
const TOKEN_KEY = 'hertz_digital_token_v1';

function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && token) {
    try {
      localStorage.removeItem('hertz_digital_user_v1');
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new Event('auth_changed'));
      }
    } catch {}
  }

  if (!res.ok) {
    let errorMsg = `Erreur HTTP ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMsg = errorData.error;
      if (errorData.details && Array.isArray(errorData.details)) {
        const firstErr = errorData.details[0];
        errorMsg = `${errorMsg} : ${firstErr.field ? firstErr.field + ' — ' : ''}${firstErr.message || ''}`;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
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

  calculateQuote: (data: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    pickupLocation?: string;
    returnLocation?: string;
    options?: BookingOption[];
  }) => request<any>('/reservations/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createReservation: (data: any) => request<Reservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getReservationById: (id: string) => request<Reservation>(`/reservations/${id}`),
  getCustomerReservations: (email?: string) => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    return request<Reservation[]>(`/reservations/customer/history${qs}`);
  },

  initiatePayment: (data: {
    reservationId: string;
    amount?: number;
    method: string;
    phone?: string;
    customerPhone?: string;
    simulateStatus?: 'SUCCESS' | 'FAILED';
  }) => request<any>('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getPaymentByRef: (reference: string) => request<any>(`/payments/${reference}`),

  getContractDetails: (reservationId: string) => request<any>(`/contracts/${reservationId}`),

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

  login: (credentials: { email: string; password: string }) => request<{ token: string; tokenType: string; expiresIn: string; user: UserSession }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (data: { name: string; email: string; password: string; phone?: string }) => request<{ token: string; tokenType: string; expiresIn: string; user: UserSession }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  demoLogin: (role: 'ADMIN' | 'CLIENT') => request<{ token: string; tokenType: string; expiresIn: string; user: UserSession }>('/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ role }),
  }),
  me: () => request<UserSession>('/auth/me'),

  queryClientAI: (query: string, context?: any) => request<any>('/ai/client-query', {
    method: 'POST',
    body: JSON.stringify({ query, context }),
  }),
  queryAdminAI: (query: string) => request<any>('/ai/admin-query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  }),
};
