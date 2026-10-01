# Hertz Digital Rental Platform — Prototype Démonstrateur

> **Prototype fonctionnel, moderne et complet d'une plateforme digitale de location de véhicules** conçu dans le cadre d'une candidature à un appel à projets et d'un entretien de recrutement (Lead Software Engineer / Solution Architect / Product Designer).

---

## 1. Présentation

**Hertz Digital Rental Platform** est une solution complète de mobilité connectée permettant d'effectuer l'intégralité d'un parcours de location automobile de façon 100% dématérialisée : de la recherche intelligente de véhicules récents jusqu'au paiement électronique instantané (Wave, Orange Money, InTouch, Cartes Bancaires) et à la génération automatique d'un **contrat officiel certifié au format PDF**.

Inspirée des plateformes internationales de référence (**IonyKar** et **StreetLoc**), cette application concilie une direction artistique épurée et luxueuse (dark theme, accents dorés, typographie moderne) et une ingénierie logicielle robuste et modulaire.

---

## 2. Fonctionnalités Implémentées

### Parcours Client (100% Fonctionnel & Navigable)
- **Landing Page & Moteur de Recherche** : Hero percutant, sélection du lieu de prise en charge (Aéroport Blaise Diagne AIBD, Dakar Centre, Saly), calendrier de dates et heures.
- **Catalogue & Filtres Dynamiques** : Filtrage par catégorie (Économique, Compacte, SUV, Berline, Premium, Utilitaire), transmission (Automatique/Manuelle), motorisation, budget max et tri par popularité ou prix.
- **Fiche Véhicule & Moteur de Pricing Dynamique** : Galerie HD, caractéristiques détaillées, calcul en temps réel du tarif en **FCFA** selon la durée et les options sélectionnées (Assurance Zéro Franchise, Conducteur additionnel, GPS, Siège enfant).
- **Panier Persistant** : Stockage persistant lors de la navigation avec récapitulatif détaillé.
- **Checkout en 5 Étapes** : Coordonnées personnelles, informations de permis de conduire, options, récapitulatif et consentement CGL.
- **Passerelle de Paiement Simulée** : Interface multi-canal interactive (Wave, Orange Money, InTouch, Carte Bancaire) avec déclenchement de succès ou d'échec pour tester la résilience applicative.
- **Confirmation & Contrat Électronique PDF** : Référence officielle (`HZ-2026-XXXX`), célébration visuelle (confetti discret), consultation et **téléchargement direct d'un PDF réel** avec signature numérique horodatée.
- **Espace Client Personnel** : Timeline de suivi en 6 étapes (*Réservation → Paiement → Confirmation → Contrat → Prise en charge → Restitution*) et historique des contrats passés.
- **Rental AI Assistant** : Assistant conversationnel capable d'analyser une demande en langage naturel (*ex: "Je cherche un SUV automatique pour 5 jours"*) et de recommander les véhicules correspondants.
- **FAQ & Support 24/7** : Accompagnement client et formulaire de contact.

### Parcours Administrateur / Back-Office (`/admin`)
- **Tableau de Bord & KPIs en Direct** : Suivi du chiffre d'affaires (18,4 millions FCFA), réservations du jour/mois, taux d'occupation de la flotte (68%).
- **Graphiques Réactifs (Recharts)** : Évolution mensuelle du CA, flux journalier de départs/retours, répartition des paiements (Wave 48%, OM 32%).
- **Gestion des Réservations** : Recherche multicritère, filtrage par statut (*PENDING, CONFIRMED, PAID, ACTIVE, COMPLETED, CANCELLED*), modification d'état et consultation du contrat.
- **Gestion de Flotte (CRUD Véhicules)** : Ajout, modification, suppression et basculement d'état en un clic (*AVAILABLE, RESERVED, RENTED, MAINTENANCE*).
- **Gestion de la Clientèle** : Répertoire des conducteurs, historique des dépenses et validation de permis.
- **Suivi des Encaissements** : Registre d'audit des transactions monétaires.
- **Inspection Véhicule — V2 Preview** : Module d'état des lieux numérique avec cartographie 2D de carrosserie, points d'impacts cliquables, jauge de carburant et relevé kilométrique.
- **Assistant Décisionnel IA Admin** : Requêtes en langage naturel sur la base de données (*ex: "Quel est le chiffre d'affaires du mois ?", "Quels véhicules sont disponibles ?"*).
- **Journal d'Audit des Notifications** : Historique d'envoi des confirmations par SMS, WhatsApp et Email.
- **Paramètres de l'Agence** : Configuration du branding, taux de TVA et devise (FCFA).

---

## 3. Architecture Logicielle

Le projet est conçu selon une architecture découplée et évolutive :

```
location-de-voiture/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Contrôleurs API REST (Vehicles, Reservations, Payments, Admin, AI)
│   │   ├── routes/            # Routeur Express unifié
│   │   ├── services/          # Logique métier pure :
│   │   │   ├── pricing.service.ts
│   │   │   ├── availability.service.ts
│   │   │   ├── contract.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── ai.service.ts
│   │   │   └── payment/       # Abstraction PaymentProvider (Mock, Wave, OM, InTouch, Card)
│   │   ├── prisma/            # Schéma SQLite et script de seed réaliste 2026
│   │   ├── tests/             # Tests unitaires Vitest
│   │   └── server.ts          # Serveur Express (port 5000)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Composants réutilisables (Header, Footer, SearchBar, AI, Cards...)
│   │   ├── pages/             # Pages client & admin
│   │   ├── layouts/           # ClientLayout et AdminLayout
│   │   ├── store/             # useCart (panier persistant), useAuth (session & mode démo)
│   │   ├── services/          # Client API HTTP
│   │   └── App.tsx            # Routage React Router v6
│   ├── package.json
│   └── vite.config.ts         # Serveur Vite avec proxy API (port 5173)
├── docs/
│   ├── architecture.md        # Documentation technique détaillée
│   └── demo.md                # Parcours pas-à-pas de démonstration
├── DEMO-SCRIPT.md             # Script de pitch en 3 minutes chrono
├── .env.example               # Modèle de variables d'environnement & note PCI-DSS
└── package.json               # Script racine unifié
```

---

## 4. Technologies Utilisées

- **Frontend** : React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, jsPDF, canvas-confetti.
- **Backend** : Node.js, Express, TypeScript, Prisma ORM, SQLite.
- **Tests** : Vitest.
- **Devise** : FCFA (Franc CFA - UEMOA).

---

## 5. Installation & Lancement Local

Le projet se lance simplement en quelques commandes :

```bash
# 1. Cloner le dépôt et se placer dans le dossier
cd "location de voiture"

# 2. Installer les dépendances du backend
cd backend
npm install

# 3. Initialiser la base de données SQLite et exécuter le seed
npx prisma db push --schema=src/prisma/schema.prisma
npx ts-node src/prisma/seed.ts

# 4. Installer les dépendances du frontend
cd ../frontend
npm install

# 5. Démarrer l'application (Backend + Frontend)
# Dans un terminal pour le Backend :
cd ../backend
npm run dev

# Dans un second terminal pour le Frontend :
cd ../frontend
npm run dev
```

L'application est immédiatement accessible sur : **`http://localhost:5173`**
L'API backend écoute sur : **`http://localhost:5000`**

---

## 6. Variables d'Environnement

Un fichier `.env.example` est fourni à la racine et documente les options de configuration.
Dans le dossier `backend/.env` :
```env
PORT=5000
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
JWT_SECRET="hertz_digital_secret_demo_2026"
```

---

## 7. Base de Données & Données de Démonstration (Seed)

Le script de seed pré-remplit une base complète avec des données cohérentes pour **Mars 2026** :
- **12 Véhicules** récents (Toyota Corolla, RAV4 AWD, Peugeot 208 GT, Hyundai Tucson, Kia Sportage, Mercedes Classe C, Renault Duster, Toyota Land Cruiser Prado 7 places, Hilux 4x4, etc.)
- **20+ Clients** d'affaires et particuliers
- **32 Réservations** réparties sur différents statuts
- **Transactions de paiement** en FCFA
- **Contrats certifiés** archivés

---

## 8. Comptes de Démonstration

Pour faciliter la présentation devant un recruteur ou un jury, un sélecteur **"Mode Démo"** est intégré directement dans le Header (1 clic pour basculer sans saisie).

| Rôle | Email | Mot de passe | Accès |
|---|---|---|---|
| **ADMINISTRATEUR** | `admin@demo.local` | `Admin123!` | `/admin` (Back-office complet) |
| **CLIENT** | `client@demo.local` | `Client123!` | `/` et `/mes-reservations` |

---

## 9. Sécurité & Conformité PCI-DSS

> [!NOTE]
> Dans ce prototype de démonstration, les transactions sont simulées au travers de l'abstraction `PaymentProvider`. **Aucune donnée sensible de carte bancaire (numéro PAN, cryptogramme CVV) n'est stockée ni ne transite par les serveurs applicatifs.**
> 
> En production, la conformité **PCI-DSS (SAQ A)** sera déléguée aux solutions certifiées de niveau 1 (passerelles directes Wave Checkout API, Orange Money Web Payment ou Stripe Elements), garantissant l'étanchéité totale de notre infrastructure.

---

## 10. Tests Automatisés

Pour exécuter la suite de tests unitaires (pricing, disponibilité, cycle de vie des paiements) :

```bash
cd backend
npm run test
```

Résultats : **100% Passed (6 tests réussis)**.

---

## 11. Script de Présentation en 3 Minutes

Consultez le fichier **[DEMO-SCRIPT.md](./DEMO-SCRIPT.md)** pour le découpage chronologique seconde par seconde destiné à un entretien de recrutement ou une soutenance d'appel d'offres.
