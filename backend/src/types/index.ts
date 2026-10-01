export type UserRole = 'CLIENT' | 'ADMIN';

export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';

export type ReservationStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PAID' 
  | 'ACTIVE' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY' | 'INTOUCH' | 'CARD';

export type PaymentStatus = 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PriceBreakdown {
  durationDays: number;
  dailyRate: number;
  subtotal: number;
  optionsTotal: number;
  oneWayFee?: number;
  taxTotal: number;
  totalAmount: number;
  depositAmount: number;
}

export interface BookingOptionItem {
  code: string;
  name: string;
  pricePerDay: number;
  quantity?: number;
}

export interface CreateReservationDto {
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  options: BookingOptionItem[];
  customer: {
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
  };
}

export interface InitiatePaymentDto {
  reservationId: string;
  method: PaymentMethod;
  customerPhone?: string;
  simulateStatus?: 'SUCCESS' | 'FAILED';
}
