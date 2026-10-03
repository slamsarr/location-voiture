-- ======================================================================
-- HERTZ DIGITAL RENTAL PLATFORM — Supabase Migration SQL
-- ======================================================================
-- Instructions:
--   1. Créez un projet Supabase sur https://supabase.com
--   2. Ouvrez SQL Editor dans le dashboard
--   3. Collez et exécutez ce script complet
--   4. Copiez les URLs de connexion dans backend/.env
-- ======================================================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

CREATE TYPE user_role       AS ENUM ('ADMIN', 'CLIENT');
CREATE TYPE vehicle_status  AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'RETIRED');
CREATE TYPE vehicle_trans   AS ENUM ('AUTOMATIQUE', 'MANUELLE');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE payment_status  AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method  AS ENUM ('WAVE', 'ORANGE_MONEY', 'CREDIT_CARD', 'CASH', 'BANK_TRANSFER');
CREATE TYPE contract_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE inspection_type AS ENUM ('PRE_RENTAL', 'POST_RENTAL');
CREATE TYPE notif_type      AS ENUM ('RESERVATION_CONFIRMED', 'PAYMENT_RECEIVED', 'CONTRACT_READY', 'REMINDER', 'ADMIN_ALERT', 'SYSTEM');

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

CREATE TABLE "User" (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  "passwordHash"  TEXT NOT NULL,
  name            TEXT NOT NULL,
  phone           TEXT,
  role            user_role NOT NULL DEFAULT 'CLIENT',
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "VehicleCategory" (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Vehicle" (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand             TEXT NOT NULL,
  model             TEXT NOT NULL,
  year              INTEGER NOT NULL,
  plate             TEXT UNIQUE NOT NULL,
  color             TEXT,
  "categoryId"      UUID NOT NULL REFERENCES "VehicleCategory"(id) ON DELETE RESTRICT,
  "dailyRate"       DECIMAL(10,2) NOT NULL,
  "weeklyRate"      DECIMAL(10,2),
  "monthlyRate"     DECIMAL(10,2),
  mileage           INTEGER NOT NULL DEFAULT 0,
  fuel              TEXT NOT NULL DEFAULT 'ESSENCE',
  transmission      vehicle_trans NOT NULL DEFAULT 'AUTOMATIQUE',
  seats             INTEGER NOT NULL DEFAULT 5,
  status            vehicle_status NOT NULL DEFAULT 'AVAILABLE',
  description       TEXT,
  features          TEXT[],
  images            TEXT[],
  "thumbnailUrl"    TEXT,
  "agencyId"        UUID,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Customer" (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId"            UUID UNIQUE REFERENCES "User"(id) ON DELETE SET NULL,
  "firstName"         TEXT NOT NULL,
  "lastName"          TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  "licenseNumber"     TEXT,
  "licenseExpiry"     DATE,
  "licenseCountry"    TEXT DEFAULT 'Sénégal',
  "licensePhotoUrl"   TEXT,
  address             TEXT,
  city                TEXT,
  country             TEXT DEFAULT 'Sénégal',
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Agency" (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  "openHours" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE "Vehicle" ADD CONSTRAINT fk_vehicle_agency FOREIGN KEY ("agencyId") REFERENCES "Agency"(id) ON DELETE SET NULL;

CREATE TABLE "Reservation" (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference       TEXT UNIQUE NOT NULL,
  "customerId"    UUID NOT NULL REFERENCES "Customer"(id) ON DELETE RESTRICT,
  "vehicleId"     UUID NOT NULL REFERENCES "Vehicle"(id) ON DELETE RESTRICT,
  "startDate"     DATE NOT NULL,
  "endDate"       DATE NOT NULL,
  "pickupAgencyId"    UUID REFERENCES "Agency"(id) ON DELETE SET NULL,
  "dropoffAgencyId"   UUID REFERENCES "Agency"(id) ON DELETE SET NULL,
  days            INTEGER NOT NULL,
  "dailyRate"     DECIMAL(10,2) NOT NULL,
  "subtotal"      DECIMAL(10,2) NOT NULL,
  taxes           DECIMAL(10,2) NOT NULL DEFAULT 0,
  "totalAmount"   DECIMAL(10,2) NOT NULL,
  "driverRequired"    BOOLEAN NOT NULL DEFAULT FALSE,
  "driverFee"     DECIMAL(10,2) NOT NULL DEFAULT 0,
  insurance       TEXT,
  "insuranceFee"  DECIMAL(10,2) NOT NULL DEFAULT 0,
  status          reservation_status NOT NULL DEFAULT 'PENDING',
  notes           TEXT,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Payment" (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference           TEXT UNIQUE NOT NULL,
  "reservationId"     UUID NOT NULL REFERENCES "Reservation"(id) ON DELETE RESTRICT,
  amount              DECIMAL(10,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'XOF',
  method              payment_method NOT NULL,
  status              payment_status NOT NULL DEFAULT 'PENDING',
  "paidAt"            TIMESTAMPTZ,
  "transactionDetails" JSONB,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Contract" (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference       TEXT UNIQUE NOT NULL,
  "reservationId" UUID NOT NULL REFERENCES "Reservation"(id) ON DELETE RESTRICT,
  content         TEXT NOT NULL,
  status          contract_status NOT NULL DEFAULT 'DRAFT',
  "signedAt"      TIMESTAMPTZ,
  "pdfUrl"        TEXT,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Inspection" (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "reservationId" UUID NOT NULL REFERENCES "Reservation"(id) ON DELETE RESTRICT,
  type            inspection_type NOT NULL,
  "mileageIn"     INTEGER,
  "mileageOut"    INTEGER,
  "fuelLevelIn"   INTEGER,
  "fuelLevelOut"  INTEGER,
  damages         JSONB,
  photos          TEXT[],
  notes           TEXT,
  "inspectorId"   UUID REFERENCES "User"(id) ON DELETE SET NULL,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Notification" (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId"    UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type        notif_type NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  data        JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

CREATE INDEX idx_vehicle_status          ON "Vehicle"(status);
CREATE INDEX idx_vehicle_category        ON "Vehicle"("categoryId");
CREATE INDEX idx_vehicle_agency          ON "Vehicle"("agencyId");
CREATE INDEX idx_reservation_customer    ON "Reservation"("customerId");
CREATE INDEX idx_reservation_vehicle     ON "Reservation"("vehicleId");
CREATE INDEX idx_reservation_dates       ON "Reservation"("startDate", "endDate");
CREATE INDEX idx_reservation_status      ON "Reservation"(status);
CREATE INDEX idx_payment_reservation     ON "Payment"("reservationId");
CREATE INDEX idx_payment_status          ON "Payment"(status);
CREATE INDEX idx_contract_reservation    ON "Contract"("reservationId");
CREATE INDEX idx_notification_user_read  ON "Notification"("userId", read);
CREATE INDEX idx_customer_user           ON "Customer"("userId");
CREATE INDEX idx_user_email              ON "User"(email);

-- ─────────────────────────────────────────────
-- TRIGGER: updatedAt auto-update
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_updated        BEFORE UPDATE ON "User"        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_vehicle_updated     BEFORE UPDATE ON "Vehicle"     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customer_updated    BEFORE UPDATE ON "Customer"    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reservation_updated BEFORE UPDATE ON "Reservation" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payment_updated     BEFORE UPDATE ON "Payment"     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_contract_updated    BEFORE UPDATE ON "Contract"    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────

-- Catégories
INSERT INTO "VehicleCategory" (id, name, description, icon) VALUES
  (uuid_generate_v4(), 'Économique',    'Idéal pour la ville, économique et pratique', '🚗'),
  (uuid_generate_v4(), 'Berline',       'Confort et élégance pour vos déplacements', '🚙'),
  (uuid_generate_v4(), 'SUV',           'Polyvalent et spacieux pour toutes routes', '🚐'),
  (uuid_generate_v4(), 'Luxe',          'Véhicules haut de gamme pour occasions spéciales', '🏎'),
  (uuid_generate_v4(), 'Utilitaire',    'Transport de marchandises et déménagement', '🚛'),
  (uuid_generate_v4(), 'Électrique',    'Mobilité propre et écologique', '⚡');

-- Agences
INSERT INTO "Agency" (id, name, city, address, phone) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Hertz Dakar Centre',       'Dakar',   'Rue du Commerce, Plateau', '+221 33 889 00 00'),
  ('a0000000-0000-0000-0000-000000000002', 'Hertz Aéroport AIBD',      'Dakar',   'Aéroport International AIBD', '+221 33 889 00 01'),
  ('a0000000-0000-0000-0000-000000000003', 'Hertz Saint-Louis',        'Saint-Louis', 'Avenue Dodds', '+221 33 889 00 02');

-- Utilisateurs demo (mdp: Demo1234!)
-- Hash bcrypt de "Demo1234!" (rounds=10): $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO "User" (id, email, "passwordHash", name, phone, role) VALUES
  ('u0000000-0000-0000-0000-000000000001', 'admin@demo.local',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur Hertz', '+221 77 000 00 00', 'ADMIN'),
  ('u0000000-0000-0000-0000-000000000002', 'client@demo.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mamadou Diallo', '+221 77 123 45 67', 'CLIENT');

-- Client associé
INSERT INTO "Customer" (id, "userId", "firstName", "lastName", email, phone, city, country) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', 'Mamadou', 'Diallo', 'client@demo.local', '+221 77 123 45 67', 'Dakar', 'Sénégal');

-- ======================================================================
-- Pour configurer Prisma, récupérez les URLs dans:
-- Supabase Dashboard > Settings > Database > Connection string
--   DATABASE_URL  → Transaction Pooler (port 6543) avec ?pgbouncer=true
--   DIRECT_URL    → Direct Connection (port 5432)
-- ======================================================================
