-- ======================================================================
-- HERTZ DIGITAL RENTAL PLATFORM — Supabase Migration SQL
-- ======================================================================
-- Instructions :
--   1. Connectez-vous à votre dashboard Supabase (https://supabase.com)
--   2. Ouvrez "SQL Editor" dans le menu de gauche
--   3. Collez l'intégralité de ce script et cliquez sur "Run"
-- ======================================================================

-- 1. Nettoyage préalable (sécurité anti-collision si relancé)
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "VehicleInspection" CASCADE;
DROP TABLE IF EXISTS "Contract" CASCADE;
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "ReservationOption" CASCADE;
DROP TABLE IF EXISTS "Reservation" CASCADE;
DROP TABLE IF EXISTS "Vehicle" CASCADE;
DROP TABLE IF EXISTS "VehicleCategory" CASCADE;
DROP TABLE IF EXISTS "Customer" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Activer l'extension UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 2. STRUCTURE DES TABLES (ALIGNÉE AVEC PRISMA)
-- ─────────────────────────────────────────────

CREATE TABLE "User" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  email           TEXT UNIQUE NOT NULL,
  "passwordHash"  TEXT NOT NULL,
  name            TEXT NOT NULL,
  phone           TEXT,
  role            TEXT NOT NULL DEFAULT 'CLIENT',
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Customer" (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "userId"          TEXT UNIQUE REFERENCES "User"(id) ON DELETE SET NULL,
  "firstName"       TEXT NOT NULL,
  "lastName"        TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT NOT NULL,
  "licenseNumber"   TEXT NOT NULL,
  "licenseExpiry"   TEXT NOT NULL,
  "licenseCountry"  TEXT NOT NULL DEFAULT 'Sénégal',
  address           TEXT,
  city              TEXT,
  country           TEXT DEFAULT 'Sénégal',
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "VehicleCategory" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Vehicle" (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  brand             TEXT NOT NULL,
  model             TEXT NOT NULL,
  year              INTEGER NOT NULL,
  "categoryId"      TEXT NOT NULL REFERENCES "VehicleCategory"(id) ON DELETE RESTRICT,
  transmission      TEXT NOT NULL DEFAULT 'MANUAL',
  fuel              TEXT NOT NULL DEFAULT 'DIESEL',
  seats             INTEGER NOT NULL DEFAULT 5,
  doors             INTEGER NOT NULL DEFAULT 5,
  "airConditioning" BOOLEAN NOT NULL DEFAULT true,
  "pricePerDay"     DOUBLE PRECISION NOT NULL,
  deposit           DOUBLE PRECISION NOT NULL,
  "mileagePolicy"   TEXT NOT NULL DEFAULT 'Kilométrage illimité',
  status            TEXT NOT NULL DEFAULT 'AVAILABLE',
  "imageUrl"        TEXT NOT NULL,
  gallery           TEXT,
  description       TEXT NOT NULL,
  features          TEXT,
  "plateNumber"     TEXT UNIQUE NOT NULL,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Reservation" (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  reference         TEXT UNIQUE NOT NULL,
  "customerId"      TEXT NOT NULL REFERENCES "Customer"(id) ON DELETE RESTRICT,
  "vehicleId"       TEXT NOT NULL REFERENCES "Vehicle"(id) ON DELETE RESTRICT,
  "startDate"       TEXT NOT NULL,
  "endDate"         TEXT NOT NULL,
  "pickupTime"      TEXT NOT NULL DEFAULT '10:00',
  "returnTime"      TEXT NOT NULL DEFAULT '10:00',
  "pickupLocation"  TEXT NOT NULL DEFAULT 'Agence Aéroport Blaise Diagne (AIBD)',
  "returnLocation"  TEXT NOT NULL DEFAULT 'Agence Aéroport Blaise Diagne (AIBD)',
  "dailyRate"       DOUBLE PRECISION NOT NULL,
  "durationDays"    INTEGER NOT NULL,
  subtotal          DOUBLE PRECISION NOT NULL,
  "optionsTotal"    DOUBLE PRECISION NOT NULL DEFAULT 0,
  "taxTotal"        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalAmount"     DOUBLE PRECISION NOT NULL,
  "depositAmount"   DOUBLE PRECISION NOT NULL,
  status            TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "ReservationOption" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "reservationId" TEXT NOT NULL REFERENCES "Reservation"(id) ON DELETE CASCADE,
  code            TEXT NOT NULL,
  name            TEXT NOT NULL,
  "pricePerDay"   DOUBLE PRECISION NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1,
  "totalPrice"    DOUBLE PRECISION NOT NULL
);

CREATE TABLE "Payment" (
  id                  TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  reference           TEXT UNIQUE NOT NULL,
  "reservationId"     TEXT NOT NULL REFERENCES "Reservation"(id) ON DELETE RESTRICT,
  amount              DOUBLE PRECISION NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'FCFA',
  method              TEXT NOT NULL,
  provider            TEXT NOT NULL DEFAULT 'MockPaymentProvider',
  status              TEXT NOT NULL DEFAULT 'INITIATED',
  "transactionDetails" TEXT,
  "paidAt"            TIMESTAMPTZ,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Contract" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  reference       TEXT UNIQUE NOT NULL,
  "reservationId" TEXT UNIQUE NOT NULL REFERENCES "Reservation"(id) ON DELETE RESTRICT,
  status          TEXT NOT NULL DEFAULT 'ISSUED',
  "signedAt"      TIMESTAMPTZ,
  "termsAccepted" BOOLEAN NOT NULL DEFAULT true,
  "pdfDataUrl"    TEXT,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "VehicleInspection" (
  id                  TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  "vehicleId"         TEXT NOT NULL REFERENCES "Vehicle"(id) ON DELETE RESTRICT,
  "reservationId"     TEXT REFERENCES "Reservation"(id) ON DELETE SET NULL,
  type                TEXT NOT NULL,
  mileage             INTEGER NOT NULL,
  "fuelLevel"         INTEGER NOT NULL,
  damages             TEXT,
  photos              TEXT,
  "inspectorNotes"    TEXT,
  "completedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Notification" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  type        TEXT NOT NULL,
  recipient   TEXT NOT NULL,
  subject     TEXT,
  content     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'SENT',
  "sentAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 3. INDEX DE PERFORMANCE
-- ─────────────────────────────────────────────

CREATE INDEX idx_vehicle_status          ON "Vehicle"(status);
CREATE INDEX idx_vehicle_category        ON "Vehicle"("categoryId");
CREATE INDEX idx_reservation_customer    ON "Reservation"("customerId");
CREATE INDEX idx_reservation_vehicle     ON "Reservation"("vehicleId");
CREATE INDEX idx_reservation_status      ON "Reservation"(status);
CREATE INDEX idx_payment_reservation     ON "Payment"("reservationId");
CREATE INDEX idx_payment_status          ON "Payment"(status);
CREATE INDEX idx_contract_reservation    ON "Contract"("reservationId");
CREATE INDEX idx_customer_user           ON "Customer"("userId");
CREATE INDEX idx_user_email              ON "User"(email);

-- ─────────────────────────────────────────────
-- 4. TRIGGER: updatedAt automatique
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_updated        BEFORE UPDATE ON "User"        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customer_updated    BEFORE UPDATE ON "Customer"    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_category_updated    BEFORE UPDATE ON "VehicleCategory" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_vehicle_updated     BEFORE UPDATE ON "Vehicle"     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reservation_updated BEFORE UPDATE ON "Reservation" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payment_updated     BEFORE UPDATE ON "Payment"     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_contract_updated    BEFORE UPDATE ON "Contract"    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 5. DONNÉES INITIALES (SEED COMPLET)
-- ─────────────────────────────────────────────

-- Catégories de véhicules
INSERT INTO "VehicleCategory" (id, name, slug, description, icon) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Économique', 'economique', 'Idéale pour la ville, compacte et faible consommation', '🚗'),
  ('c0000001-0000-0000-0000-000000000002', 'Compacte',   'compacte',   'Maniabilité, confort et polyvalence urbaine et routière', '🚙'),
  ('c0000001-0000-0000-0000-000000000003', 'Berline',    'berline',    'Grand confort, espace aux jambes et voyages d’affaires', '✨'),
  ('c0000001-0000-0000-0000-000000000004', 'SUV',        'suv',        'Hauteur de caisse, sécurité et habitacle généreux pour tous trajets', '🚐'),
  ('c0000001-0000-0000-0000-000000000005', 'Premium',    'premium',    'Luxe, finitions d’exception et performances incomparables', '👑'),
  ('c0000001-0000-0000-0000-000000000006', 'Utilitaire', 'utilitaire', 'Volume de chargement pour vos déplacements professionnels', '🚛');

-- Utilisateurs de démonstration
-- Mot de passe Admin : Admin123!
-- Mot de passe Client : Client123!
INSERT INTO "User" (id, email, "passwordHash", name, phone, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'admin@demo.local',  '$2b$10$uCoYizENUkOVn3dg4catZeShdY0E73Q5s8WC2llwolLrIhrQT6day', 'Directeur d’Agence (Admin)', '+221 77 123 45 67', 'ADMIN'),
  ('b1000000-0000-0000-0000-000000000002', 'client@demo.local', '$2b$10$UF9VEC/56NY1oKa0nwhhXewf67377leV.wrpSkukF2gIz1GS3/BzO', 'Amadou Diallo',            '+221 78 987 65 43', 'CLIENT');

-- Profil client de démonstration rattaché
INSERT INTO "Customer" (id, "userId", "firstName", "lastName", email, phone, "licenseNumber", "licenseExpiry", "licenseCountry", address, city, country) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Amadou', 'Diallo', 'client@demo.local', '+221 78 987 65 43', 'SN-DKR-2018-98452', '2028-11-20', 'Sénégal', 'Almadies, Lot 14', 'Dakar', 'Sénégal');

-- Les 12 Véhicules du Catalogue Hertz
INSERT INTO "Vehicle" (id, brand, model, year, "categoryId", transmission, fuel, seats, doors, "airConditioning", "pricePerDay", deposit, "mileagePolicy", status, "imageUrl", description, features, "plateNumber") VALUES
  ('v0000000-0000-0000-0000-000000000001', 'Toyota', 'Corolla', 2024, 'c0000001-0000-0000-0000-000000000002', 'AUTOMATIC', 'HYBRID', 5, 5, true, 35000, 200000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=900',
   'La Toyota Corolla Hybride offre une douceur de conduite inégalée et une consommation minime. Équipée d’Apple CarPlay, climatisation bizone et régulateur adaptatif.',
   '["Boîte Automatique","Hybride essence","Apple CarPlay & Android Auto","Caméra de recul","Climatisation bizone"]', 'DK-2024-HZ01'),

  ('v0000000-0000-0000-0000-000000000002', 'Toyota', 'RAV4 AWD', 2024, 'c0000001-0000-0000-0000-000000000004', 'AUTOMATIC', 'HYBRID', 5, 5, true, 55000, 300000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=900',
   'SUV de référence combinant puissance, transmission intégrale AWD et confort premium pour tous vos trajets vers Dakar, Saly ou les régions.',
   '["Transmission 4x4 AWD","Toit ouvrant panoramique","Sellerie cuir","Aide au stationnement 360°","Coffre géant"]', 'DK-2024-HZ02'),

  ('v0000000-0000-0000-0000-000000000003', 'Peugeot', '208 GT', 2024, 'c0000001-0000-0000-0000-000000000001', 'MANUAL', 'GASOLINE', 5, 5, true, 25000, 150000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=900',
   'Citadine chic, nerveuse et très économe. Le célèbre i-Cockpit 3D Peugeot offre une ergonomie parfaite en circulation dense.',
   '["i-Cockpit 3D","Climatisation automatique","Radar de stationnement","Bluetooth audio","Feux Full LED"]', 'DK-2024-HZ03'),

  ('v0000000-0000-0000-0000-000000000004', 'Hyundai', 'Tucson N-Line', 2024, 'c0000001-0000-0000-0000-000000000004', 'AUTOMATIC', 'DIESEL', 5, 5, true, 50000, 250000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=900',
   'Design avant-gardiste et signature lumineuse unique. Ce Hyundai Tucson offre un confort de suspension exceptionnel.',
   '["Écran tactile 10.25\\"","Sièges ventilés et chauffants","Freinage d’urgence autonome","Régulateur de vitesse"]', 'DK-2024-HZ04'),

  ('v0000000-0000-0000-0000-000000000005', 'Kia', 'Sportage GT-Line', 2024, 'c0000001-0000-0000-0000-000000000004', 'AUTOMATIC', 'DIESEL', 5, 5, true, 52000, 250000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=900',
   'SUV moderne et spacieux doté d’un double écran panoramique incurvé et d’une habitabilité de premier ordre.',
   '["Écran panoramique incurvé","Système audio premium","Phares matriciels LED","Jantes alliage 19\\""]', 'DK-2024-HZ05'),

  ('v0000000-0000-0000-0000-000000000006', 'Mercedes-Benz', 'Classe C 220d', 2024, 'c0000001-0000-0000-0000-000000000005', 'AUTOMATIC', 'DIESEL', 5, 4, true, 95000, 600000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=900',
   'Le summum de l’élégance pour vos déplacements officiels ou rendez-vous d’affaires. Habitacle MBUX et insonorisation remarquable.',
   '["Intérieur cuir Nappa","Système MBUX avec commande vocale","Suspension adaptative","Éclairage d’ambiance 64 couleurs"]', 'DK-2024-HZ06'),

  ('v0000000-0000-0000-0000-000000000007', 'Peugeot', '3008 Allure', 2023, 'c0000001-0000-0000-0000-000000000004', 'AUTOMATIC', 'DIESEL', 5, 5, true, 48000, 250000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=900',
   'Le SUV le plus plébiscité. Tenue de route irréprochable et grand coffre modulable pour familles et professionnels.',
   '["Navigation GPS 3D","Grip Control tout chemin","Accès et démarrage mains libres","Barres de toit"]', 'DK-2023-HZ07'),

  ('v0000000-0000-0000-0000-000000000008', 'Renault', 'Duster 4x4', 2023, 'c0000001-0000-0000-0000-000000000004', 'MANUAL', 'DIESEL', 5, 5, true, 38000, 200000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=900',
   'Robuste, tout-terrain efficace et économique, le Duster est le compagnon idéal pour explorer toutes les pistes en toute sérénité.',
   '["Transmission 4x4 verrouillable","Garde au sol surélevée","Protection sous châssis","Climatisation renforcée"]', 'DK-2023-HZ08'),

  ('v0000000-0000-0000-0000-000000000009', 'Toyota', 'Land Cruiser Prado TX-L', 2024, 'c0000001-0000-0000-0000-000000000005', 'AUTOMATIC', 'DIESEL', 7, 5, true, 130000, 800000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=900',
   'Le géant tout-terrain par excellence. 7 vraies places, fiabilité légendaire et sécurité maximale pour délégations et longs voyages.',
   '["7 places spacieuses","Vrai 4x4 avec boîte de transfert","Glacière centrale réfrigérée","Double réservoir"]', 'DK-2024-HZ09'),

  ('v0000000-0000-0000-0000-000000000010', 'Toyota', 'Hilux Double Cabine 4x4', 2023, 'c0000001-0000-0000-0000-000000000006', 'MANUAL', 'DIESEL', 5, 4, true, 45000, 250000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=900',
   'Pick-up utilitaire tout terrain indestructible. Benne spacieuse pour outillage, fret ou expéditions professionnelles.',
   '["Benne grand volume avec bac","Attelage remorque","4x4 tout-terrain","Capacité de charge 1 tonne"]', 'DK-2023-HZ10'),

  ('v0000000-0000-0000-0000-000000000011', 'Mercedes-Benz', 'Classe E 300 Exclusive', 2024, 'c0000001-0000-0000-0000-000000000003', 'AUTOMATIC', 'GASOLINE', 5, 4, true, 110000, 700000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=900',
   'La référence mondiale de la grande berline de standing. Confort princier, suspension pneumatique et finitions bois noble.',
   '["Suspension pneumatique Air Body","Son Surround Burmester 3D","Sièges massants","Assistance à la conduite niveau 2"]', 'DK-2024-HZ11'),

  ('v0000000-0000-0000-0000-000000000012', 'Hyundai', 'Grand i10', 2023, 'c0000001-0000-0000-0000-000000000001', 'MANUAL', 'GASOLINE', 5, 5, true, 20000, 120000, 'Kilométrage illimité', 'AVAILABLE',
   'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=900',
   'Petite citadine économique et agile, idéale pour se garer facilement en centre-ville.',
   '["Ultra maniable","Faible consommation","Climatisation","Bluetooth"]', 'DK-2023-HZ12');
