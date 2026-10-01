# Architecture Technique - Hertz Digital Rental Platform

## 1. Vue d'Ensemble & Vision Produit

Ce document décrit l'architecture logicielle, les flux de données et les choix d'ingénierie retenus pour le prototype fonctionnel de la plateforme de location automobile dématérialisée **Hertz Digital Rental Platform**.

La plateforme a été conçue pour démontrer la capacité à transformer un cahier des charges métier exigeant (inspiré de plateformes leaders comme **IonyKar** et **StreetLoc**) en une application web moderne, évolutive, hautement performante et prête pour la production.

```
                     ┌─────────────────────────────────────────┐
                     │          FRONTEND (React + Vite)        │
                     │  Tailwind CSS • Lucide • Recharts • PDF │
                     └────────────────────┬────────────────────┘
                                          │
                                 Appels REST / API
                                          │
                     ┌────────────────────▼────────────────────┐
                     │       API BACKEND (Node.js + Express)   │
                     │          Architecture en Couches        │
                     └─┬──────────────┬──────────────┬─────────┘
                       │              │              │
       ┌───────────────▼──┐   ┌───────▼───────┐  ┌───▼───────────────┐
       │ PricingService   │   │PaymentService │  │  ContractService  │
       │ Calcul dynamique │   │Mock / Wave /  │  │  Génération PDF   │
       │ & devis en FCFA  │   │Orange Money   │  │  & Certif. légale │
       └──────────────────┘   └───────────────┘  └───────────────────┘
                                      │
                     ┌────────────────▼────────────────────────┐
                     │      BASE DE DONNÉES (Prisma ORM)       │
                     │      SQLite Démo (Prêt PostgreSQL)     │
                     └─────────────────────────────────────────┘
```

---

## 2. Découpage en Couches (Separation of Concerns)

### Frontend (`/frontend`)
- **Présentation & UI Composants** : Construits avec Tailwind CSS et des composants d'inspiration shadcn/ui.
- **Gestion de Navigation** : React Router v6 avec routage public (`/`, `/vehicules`, `/panier`, `/checkout`, `/confirmation`) et espace back-office (`/admin`).
- **Gestion d'État** : Custom hooks réactifs persistants (`useCart`, `useAuth`) sans surcharge de bibliothèques lourdes.
- **Rapports & Data-Visualisation** : Recharts pour le suivi des KPI d'exploitation et du chiffre d'affaires.
- **Édition Documentaire** : `jsPDF` pour la génération et le téléchargement direct de contrats officiels conformes.

### Backend (`/backend`)
- **Contrôleurs REST (`/controllers`)** : Point d'entrée HTTP, désérialisation, validation et formatage des réponses JSON.
- **Services Métier (`/services`)** :
  - `PricingService` : Calcul arithmétique dynamique des jours, suppléments d'options, taxes et cautions en FCFA.
  - `AvailabilityService` : Détection des conflits de dates sur les réservations actives.
  - `PaymentService` & `PaymentProvider` : Interface standardisée permettant d'interchanger instantanément la simulation `MockPaymentProvider` avec des passerelles réelles (`WavePaymentProvider`, `OrangeMoneyPaymentProvider`, `IntouchPaymentProvider`, `CardPaymentProvider`).
  - `ContractService` : Agrégation des clauses contractuelles, horodatage et empreinte numérique pour conformité légale.
  - `AIService` : Moteur de recommandation en langage naturel (client) et moteur d'aide à la décision (admin).
  - `NotificationService` : Journal d'audit et distribution multi-canale (SMS, WhatsApp, Email).

---

## 3. Sécurité & Conformité PCI-DSS

1. **Isolation des Paiements** :
   Le prototype n'enregistre aucune donnée de carte bancaire (numéro PAN, CVV, code PIN). Les flux bancaires sont simulés selon une architecture conforme SAQ A / Niveau 1, où l'acquisition est déléguée à la passerelle de paiement tierce.
2. **Gestion des Secrets** :
   Aucun mot de passe ni clé API n'est stocké en clair dans le code. Utilisation d'un fichier standardisé `.env.example`.
3. **Contrôle d'Accès par Rôles (RBAC)** :
   Séparation stricte des privilèges entre `CLIENT` et `ADMIN`.
