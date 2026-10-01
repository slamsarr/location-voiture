export interface VehicleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  _count?: { vehicles: number };
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  categoryId: string;
  category: VehicleCategory;
  transmission: 'MANUAL' | 'AUTOMATIC';
  fuel: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
  seats: number;
  doors: number;
  airConditioning: boolean;
  pricePerDay: number;
  deposit: number;
  mileagePolicy: string;
  status: 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';
  imageUrl: string;
  gallery?: string;
  description: string;
  features?: string;
  plateNumber: string;
}

export interface BookingOption {
  code: string;
  name: string;
  pricePerDay: number;
  quantity?: number;
  description?: string;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseCountry?: string;
  address?: string;
  city?: string;
  country?: string;
  kycVerified?: boolean;
}

export interface CartItem {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  durationDays: number;
  options: BookingOption[];
  dailyRate: number;
  subtotal: number;
  optionsTotal: number;
  oneWayFee?: number;
  taxTotal: number;
  totalAmount: number;
  depositAmount: number;
}

export interface Reservation {
  id: string;
  reference: string;
  customerId: string;
  customer: CustomerData;
  vehicleId: string;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  dailyRate: number;
  durationDays: number;
  subtotal: number;
  optionsTotal: number;
  taxTotal: number;
  totalAmount: number;
  depositAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  options?: any[];
  payments?: any[];
  contract?: any;
  createdAt: string;
}

export interface DashboardStats {
  kpis: {
    todayReservations: number;
    monthReservations: number;
    totalReservations: number;
    totalRevenue: number;
    pendingPaymentsCount: number;
    totalVehicles: number;
    availableVehicles: number;
    rentedVehicles: number;
    maintenanceVehicles: number;
    fleetUtilizationRate: number;
  };
  charts: {
    revenueByMonth: { month: string; ca: number; reservations: number }[];
    reservationsByDay: { day: string; bookings: number; returns: number }[];
    paymentMethodsBreakdown: { name: string; count: number; percentage: number; color: string }[];
    topVehicles: { name: string; category: string; bookings: number; revenue: number; image: string }[];
  };
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'ADMIN';
  phone?: string;
}
