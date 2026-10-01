/**
 * Point d'entrée Hostinger Express.
 * Le build génère backend/dist/server.js (TypeScript compilé).
 * Ce fichier est nécessaire car Hostinger s'attend à trouver un
 * point d'entrée exécutable à la RACINE du repo.
 */
require('./backend/dist/server.js');
