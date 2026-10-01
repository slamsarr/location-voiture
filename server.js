/**
 * Point d'entrée Express pour déploiement Hostinger.
 *
 * Comportement adaptatif selon le contexte d'appel :
 *   • require()  → exporte l'application Express (phase de détection Hostinger)
 *   • node server.js → démarre réellement le serveur HTTP écoute sur PORT
 *
 * Évite les doubles "EADDRINUSE" quand Hostinger appelle require() + node server.js
 * dans le même process pendant la phase de build / détection.
 */
const fs = require('fs');
const path = require('path');

const BUILD_ENTRY = path.resolve(__dirname, 'backend', 'dist', 'server.js');
const FALLBACK_ENTRY = path.resolve(__dirname, 'backend', 'server.js');

function resolveApp() {
  if (fs.existsSync(BUILD_ENTRY)) {
    return require(BUILD_ENTRY);
  }
  if (fs.existsSync(FALLBACK_ENTRY)) {
    return require(FALLBACK_ENTRY);
  }
  console.warn('⚠️  [Pre-build] Build output introuvable.');
  console.warn('      Hostinger exécute souvent le point d\'entrée avant le build');
  console.warn('      pour la détection de l\'application — ceci est NORMAL.');
  console.warn('      → Exécutez "npm run build:hostinger" pour générer backend/dist/server.js');
  return null;
}

const appModule = resolveApp();
const app = (appModule && appModule.default) ? appModule.default : (appModule || null);

if (require.main === module && app && typeof app.listen === 'function') {
  const PORT = process.env.PORT || 5000;
  const isProduction = process.env.NODE_ENV === 'production' || true;
  const url = process.env.APP_URL || `http://localhost:${PORT}`;

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚗 Hertz Digital Rental Platform`);
    console.log(`🌍 Environnement : ${isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT'}`);
    console.log(`📡 URL           : ${url}`);
    console.log(`🔌 Port          : ${PORT}`);
    console.log(`🎨 Frontend      : Intégré (SPA servi par Node.js)`);
    console.log(`⚡ Statut        : En ligne ✅`);
    console.log(`=======================================================`);
  });
} else {
  module.exports = app || {};
}
