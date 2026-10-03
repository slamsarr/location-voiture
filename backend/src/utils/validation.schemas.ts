import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Format email invalide').min(3).max(255),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').max(255),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nom invalide').max(255),
  email: z.string().email('Format email invalide').min(3).max(255),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(255)
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  phone: z.string().optional().or(z.string().max(50)),
});

export const DemoLoginSchema = z.object({
  role: z.enum(['ADMIN', 'CLIENT'], { required_error: 'Le rôle est requis (ADMIN | CLIENT)' }),
});

export const QuoteSchema = z.object({
  vehicleId: z.string().uuid('ID véhicule invalide'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de début invalide (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de fin invalide (YYYY-MM-DD)'),
  pickupLocation: z.string().optional().or(z.string().max(255)),
  returnLocation: z.string().optional().or(z.string().max(255)),
  options: z.array(z.object({
    code: z.string().max(50),
    name: z.string().max(255),
    pricePerDay: z.number().min(0),
    quantity: z.number().int().min(1).optional(),
  })).optional(),
});

export const CreateReservationSchema = z.object({
  vehicleId: z.string().uuid('ID véhicule invalide'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de début invalide (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date de fin invalide (YYYY-MM-DD)'),
  pickupTime: z.string().optional().or(z.string().regex(/^\d{2}:\d{2}$/)),
  returnTime: z.string().optional().or(z.string().regex(/^\d{2}:\d{2}$/)),
  pickupLocation: z.string().max(255),
  returnLocation: z.string().max(255),
  customer: z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
    email: z.string().email(),
    phone: z.string().min(6).max(50),
    licenseNumber: z.string().min(4).max(100),
    licenseExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    licenseCountry: z.string().optional().or(z.string().max(100)),
    address: z.string().optional().or(z.string().max(500)),
    city: z.string().optional().or(z.string().max(255)),
    country: z.string().optional().or(z.string().max(255)),
    userId: z.string().uuid().optional(),
  }),
  options: z.array(z.object({
    code: z.string().max(50),
    name: z.string().max(255),
    pricePerDay: z.number().min(0),
    quantity: z.number().int().min(1).optional(),
  })).optional(),
});

export const UpdateReservationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED'], {
    required_error: 'Statut invalide',
  }),
});

export const InitiatePaymentSchema = z.object({
  reservationId: z.string().uuid('ID réservation invalide'),
  amount: z.number().min(0, 'Le montant ne peut pas être négatif').optional(),
  method: z.enum(['WAVE', 'ORANGE_MONEY', 'INTOUCH', 'CARD'], {
    required_error: 'Méthode de paiement invalide',
  }),
  phone: z.string().optional().or(z.string().max(50)),
  customerPhone: z.string().optional().or(z.string().max(50)),
  simulateStatus: z.enum(['SUCCESS', 'FAILED']).optional(),
});

export const CreateVehicleSchema = z.object({
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  categoryId: z.string().uuid('ID catégorie invalide'),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']).optional(),
  fuel: z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC']).optional(),
  seats: z.number().int().min(1).max(20).optional(),
  doors: z.number().int().min(1).max(10).optional(),
  airConditioning: z.boolean().optional(),
  pricePerDay: z.number().min(0),
  deposit: z.number().min(0),
  mileagePolicy: z.string().max(255).optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE']).optional(),
  imageUrl: z.string().url('URL image invalide').max(2000),
  gallery: z.string().optional(),
  description: z.string().min(10).max(5000),
  features: z.string().optional(),
  plateNumber: z.string().min(3).max(50),
});

export const UpdateVehicleSchema = CreateVehicleSchema.partial();

export const ClientAIQuerySchema = z.object({
  query: z.string().min(2, 'La requête est trop courte').max(2000, 'Requête trop longue'),
  context: z.object({
    pickupLocation: z.string().optional(),
    dates: z.object({ start: z.string().optional(), end: z.string().optional() }).optional(),
  }).optional(),
});

export const AdminAIQuerySchema = z.object({
  query: z.string().min(2, 'La requête est trop courte').max(3000),
});

export const CreateInspectionSchema = z.object({
  vehicleId: z.string().uuid('ID véhicule invalide'),
  reservationId: z.string().uuid().optional(),
  type: z.enum(['CHECK_IN', 'CHECK_OUT'], { required_error: 'Type d’inspection invalide' }),
  mileage: z.number().int().min(0),
  fuelLevel: z.number().int().min(0).max(100, 'Niveau carburant : 0-100 %'),
  damages: z.string().optional(),
  photos: z.string().optional(),
  inspectorNotes: z.string().optional().or(z.string().max(5000)),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255).optional(),
  phone: z.string().min(6, 'Numéro de téléphone invalide').max(50).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(255).optional(),
  country: z.string().max(255).optional(),
  licenseNumber: z.string().min(3).max(100).optional(),
  licenseExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date d’expiration invalide (YYYY-MM-DD)').optional(),
  licenseCountry: z.string().max(100).optional(),
  licensePhotoUrl: z.string().max(5000000).optional(), // supporte base64 ou URL
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

export const WebhookPaymentSchema = z.object({
  event: z.string(),
  reference: z.string(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']),
  amount: z.number().optional(),
  method: z.string().optional(),
  signature: z.string().optional(),
});

