# Script de Démonstration en 3 Minutes Chrono (Entretien Recruteur / Appel à Projets)

Ce guide détaille mot à mot et seconde par seconde le parcours à dérouler pour bluffer un recruteur ou un décideur en **3 minutes pile**.

---

### **00:00 - 00:20 | Introduction & Vision Métier**
> *"Bonjour. Pour répondre à votre appel à projet de modernisation locative, je ne me suis pas contenté de rédiger une réponse théorique : j'ai conçu et développé un prototype full-stack complet, opérationnel et prêt pour la démonstration.*
> *Voici la plateforme **Hertz Digital Rental Platform**, inspirée des meilleurs standards européens comme IonyKar et StreetLoc, mais spécifiquement adaptée aux réalités du marché ouest-africain avec la gestion des devises en FCFA et des paiements mobiles (Wave, Orange Money)."*

---

### **00:20 - 00:45 | Moteur de Recherche & Catalogue Dynamique**
> *(Action à l'écran : Sur la page d'accueil, montrer le Hero et le moteur de recherche.)*
> *"Dès la page d'accueil, le client bénéficie d'une ergonomie épurée. Je sélectionne mes dates de location à l'Aéroport Blaise Diagne et je clique sur 'Rechercher un véhicule'.*
> *Le catalogue filtre en temps réel les véhicules réellement disponibles dans la base de données. On y retrouve 12 véhicules segmentés (Économique, SUV, Premium) avec toutes leurs caractéristiques techniques, photos HD et le montant de la caution."*

---

### **00:45 - 01:15 | Fiche Véhicule & Calcul Dynamique du Prix**
> *(Action à l'écran : Cliquer sur la Toyota Corolla ou le Toyota RAV4, ajuster les dates et cocher l'option 'Assurance Zéro Franchise'.)*
> *"Sur la fiche véhicule, observez le moteur de pricing dynamique : lorsque j'ajuste la durée ou que j'active l'Assurance Zéro Franchise, le devis en FCFA se recalcule instantanément sans recharger la page.*
> *Je clique sur 'Réserver ce véhicule' pour l'ajouter à mon panier persistant, puis je passe au checkout en 5 étapes progressives."*

---

### **01:15 - 01:30 | Checkout & Paiement Simulé (Wave / Orange Money)**
> *(Action à l'écran : Cliquer sur 'Remplir profil démo' pour aller vite, puis valider jusqu'à la passerelle de paiement.)*
> *"Grâce au bouton de démo, les coordonnées du conducteur et son numéro de permis sont injectés en 1 seconde. J'arrive sur notre passerelle de paiement.*
> *L'architecture repose sur un `PaymentProvider` modulaire. Aujourd'hui, nous simulons un paiement instantané par Wave ou Orange Money, mais l'architecture est prête à être connectée aux vraies API en production.*
> *Je valide le paiement de 200 000 FCFA : la transaction est approuvée en temps réel."*

---

### **01:30 - 01:50 | Confirmation & Contrat Électronique Téléchargeable**
> *(Action à l'écran : Montrer l'écran de succès avec le confetti, puis cliquer sur 'Visualiser & Télécharger mon Contrat'.)*
> *"La réservation est confirmée avec la référence officielle `HZ-2026-XXXX`. Une notification automatique WhatsApp et SMS a été archivée.*
> *Mieux encore : le système a automatiquement rédigé le **contrat de location électronique**. En cliquant sur 'Télécharger le PDF', un document officiel conforme avec mentions légales, tableau financier et signature électronique horodatée est généré à la volée."*

---

### **01:50 - 02:20 | Immersion dans le Back-Office Administrateur**
> *(Action à l'écran : Cliquer sur 'Back-Office' dans le menu pour basculer sur `/admin`.)*
> *"Passons maintenant côté agence. En un clic, je bascule sur le Back-Office réservé aux gestionnaires de flotte.*
> *Dans l'onglet 'Réservations', nous retrouvons immédiatement la réservation que nous venons de créer. Le gestionnaire peut changer son statut en direct, consulter le dossier client ou réémettre le contrat."*

---

### **02:20 - 02:40 | Dashboard KPIs & Inspection Véhicule V2**
> *(Action à l'écran : Montrer le Dashboard Recharts puis la page 'Inspection Véhicule – V2'.)*
> *"Sur le Tableau de bord, Recharts restitue les KPIs opérationnels : 18,4 millions FCFA de chiffre d'affaires, taux d'occupation de la flotte à 68%, et répartition des encaissements dominée par Wave.*
> *Et parce que nous anticipons la suite, j'ai également prototypé l'onglet **'Inspection V2'** : une cartographie 2D interactive pour relever les rayures sur carrosserie et les niveaux de carburant avant et après location."*

---

### **02:40 - 03:00 | Assistant Décisionnel IA & Conclusion**
> *(Action à l'écran : Ouvrir 'Assistant IA Admin' et cliquer sur 'Quels véhicules sont disponibles ?' ou 'Quel est le chiffre d'affaires du mois ?'.)*
> *"Enfin, nous avons intégré un module d'intelligence artificielle locale : le **Rental AI Assistant**, capable d'orienter les clients en langage naturel et de répondre aux requêtes décisionnelles de la direction.*
> *En conclusion : ce prototype prouve non seulement ma parfaite maîtrise de la stack moderne (React, TypeScript, Node.js, Prisma, SQLite), mais surtout ma capacité à livrer un produit fini, robuste et aligné avec vos objectifs stratégiques en 2 mois. Je suis prêt à débuter."*

---

### Aide-mémoire des Comptes de Démonstration :
- **Admin** : `admin@demo.local` / `Admin123!`
- **Client** : `client@demo.local` / `Client123!`
- *(Ou utilisez directement le sélecteur "Mode Démo" dans le Header).*
