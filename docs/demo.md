# Guide de Démonstration - Parcours Recommandé

Ce guide détaille le parcours pas-à-pas pour tester et valider l'ensemble des 15 phases du prototype sans aucune intervention technique.

---

## Étape 1 : Page d'Accueil & Recherche
1. Ouvrez l'application à l'adresse : `http://localhost:5173`
2. Observez la direction artistique inspirée d'IonyKar et StreetLoc (thème sombre luxueux, accents dorés, typographie Plus Jakarta Sans).
3. Dans le moteur de recherche :
   - Lieu : *Aéroport Blaise Diagne (AIBD)*
   - Dates : *Par défaut ou modifiées*
4. Cliquez sur **"Rechercher un véhicule"**.

---

## Étape 2 : Catalogue & Filtres Dynamiques
1. Sur la page `/vehicules`, observez le badge de disponibilité en direct.
2. Testez les filtres :
   - Cliquez sur **"SUV"** ou **"Boîte Automatique"**.
   - Ajustez le curseur de prix maximum.
3. Observez la réactivité instantanée du catalogue.

---

## Étape 3 : Fiche Véhicule & Calcul de Prix Dynamique
1. Cliquez sur la **Toyota Corolla** (ou le Toyota RAV4).
2. Modifiez la date de retour (ex: ajoutez 2 jours supplémentaires).
3. Cochez l'option **"Assurance Zéro Franchise"**.
4. Constatez que le sous-total, le supplément d'option et le total TTC en FCFA se recalculent en direct.
5. Cliquez sur **"Réserver ce véhicule"**.

---

## Étape 4 : Panier & Checkout en 5 Étapes
1. Dans le panier (`/panier`), vérifiez les montants et cliquez sur **"Passer au Checkout"**.
2. Sur la page `/checkout` :
   - Cliquez sur le bouton en haut **"Remplir profil démo"** pour pré-remplir les données du client (Amadou Diallo, permis sénégalais).
   - Cliquez sur **"Continuer"** pour parcourir les étapes jusqu'à la passerelle de paiement.

---

## Étape 5 : Simulation de Paiement Multi-Canal
1. Sur la page de paiement :
   - Choisissez **Wave** ou **Orange Money**.
   - Cliquez sur le bouton principal doré **"Confirmer et Payer"**.
2. Admirez l'animation d'autorisation et la transition vers la confirmation.
3. *(Optionnel : vous pouvez tester le bouton "Tester le scénario d'échec" pour vérifier la gestion des erreurs).*

---

## Étape 6 : Confirmation & Téléchargement du Contrat PDF
1. Un effet de confetti discret salue la réussite de la réservation.
2. La référence unique `HZ-2026-XXXXXX` s'affiche.
3. Cliquez sur **"Visualiser & Télécharger mon Contrat (PDF)"**.
4. Le document officiel s'affiche avec la signature électronique certifiée et l'en-tête officiel.
5. Cliquez sur **"Télécharger le PDF"** : un fichier PDF réel et prêt à être imprimé est généré sur votre ordinateur !

---

## Étape 7 : Espace Client
1. Cliquez sur **"Voir mon espace réservations"** (`/mes-reservations`).
2. Observez la timeline en 6 étapes et retrouvez l'historique complet de vos locations passées et en cours.

---

## Étape 8 : Back-Office Administrateur (`/admin`)
1. Cliquez sur **"Back-Office"** dans le menu ou utilisez le sélecteur "Mode Démo" pour choisir **"Admin Démo"**.
2. **Dashboard** :
   - Visualisez les KPIs réalistes (18,4 millions FCFA de CA, réservations quotidiennes, méthodes de paiement).
   - Observez les graphiques Recharts fluides et réactifs.
3. **Réservations** :
   - Retrouvez immédiatement la réservation effectuée à l'étape 5.
   - Cliquez sur l'icône œil pour inspecter le dossier et modifiez son statut.
4. **Flotte Véhicules** :
   - Testez l'ajout, la modification ou le basculement d'un véhicule en mode "MAINTENANCE".
5. **Inspection Véhicule V2** :
   - Explorez la maquette d'état des lieux numérique avec points d'impacts cliquables et jauge de carburant.
6. **Assistant IA Admin** :
   - Posez une question comme *"Quel est le chiffre d'affaires du mois ?"* ou *"Quelles sont les réservations impayées ?"* pour voir l'IA extraire les données en direct.
