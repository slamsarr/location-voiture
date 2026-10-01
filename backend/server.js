/**
 * Point d'entrée fallback pour Hostinger (backend/server.js).
 * Hostinger recherche automatiquement backend/server.js en plus du
 * server.js racine.
 *
 * Même logique que le root server.js :
 *   • require()       → exporte l'app Express (détection Hostinger)
 *   • node server.js  → démarre le serveur HTTP
 */
const fs = require('fs');
const path = require('path');

const BUILD_ENTRY = path.resolve(__dirname, 'dist', 'server.js');

function resolveApp() {
  if (fs.existsSync(BUILD_ENTRY)) {
    return require(BUILD_ENTRY);
  }
  console.warn('⚠️  [Pre-build] backend/dist/server.js introuvable.');
  console.warn('      Phase de détection Hostinger normale — le build va bientôt être lancé.');
  return null;
}

const appModule = resolveApp();
const app = (appModule && appModule.default) ? appModule.default : (appModule || null);

if (require.main === module && app && typeof app.listen === 'function') {
  const PORT = process.env.PORT || 5000;
  const url = process.env.APP_URL || `http://localhost:${PORT}`;
  const isProduction = process.env.NODE_ENV === 'production' || true;

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚗 Hertz Digital Rental Platform (backend entry)`);
    console.log(`🌍 Environnement : ${isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT'}`);
    console.log(`📡 URL           : ${url}`);
    console.log(`🔌 Port          : ${PORT}`);
    console.log(`⚡ Statut        : En ligne ✅`);
    console.log(`=======================================================`);
  });
} else {
  module.exports = app || {};
}
