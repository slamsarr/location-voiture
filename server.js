/**
 * Hertz Digital Rental Platform - Entry Point (Racine)
 *
 * Point d'entrée Express pour déploiement Hostinger.
 * -----------------------------------------------------------------
 * IMPORTANT (analyse statique Hostinger) :
 *   Ce fichier utilise des require() STATIQUES pour que l'outil
 *   de déploiement Hostinger puisse détecter les dépendances
 *   Express et serveur, et valider que le root package.json
 *   contient bien les server dependencies (et non pas seulement
 *   des scripts de délégation).
 *
 * Comportement adaptatif :
 *   - require('./server.js') → exporte l'application (détection)
 *   - node server.js        → démarre le serveur (listen)
 *   - build encore absent   → fallback : ne plante pas (msg explicite)
 * -----------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const BUILD_PATH = path.join(__dirname, 'backend', 'dist', 'server.js');
const FALLBACK_PATH = path.join(__dirname, 'backend', 'server.js');

let app = null;

if (fs.existsSync(BUILD_PATH)) {
  const built = require('./backend/dist/server.js');
  app = (built && built.default) ? built.default : built;
} else if (fs.existsSync(FALLBACK_PATH)) {
  const built = require('./backend/server.js');
  app = (built && built.default) ? built.default : built;
} else {
  console.warn('============================================================');
  console.warn('⚠️  [PRE-BUILD] Build backend introuvable');
  console.warn('      server.js appelé avant npm run build:hostinger');
  console.warn('      — ceci est NORMAL pendant la détection Hostinger.');
  console.warn('      Le build va être lancé et générer backend/dist/server.js');
  console.warn('============================================================');
  app = express();
  app.use(cors());
  app.get('/api/health', (_req, res) => res.status(200).json({
    status: 'pre-build',
    message: 'Hertz Digital Rental Platform - Build en cours, rafraîchir dans 30s.'
  }));
  app.get('/', (_req, res) => res.type('html').send(
    '<html><body style="font-family:system-ui;padding:4rem;text-align:center">' +
    '<h1 style="color:#B8962C">🚗 Hertz Digital Rental Platform</h1>' +
    '<p>Build en cours de déploiement... rafraîchissez la page dans 1 minute.</p>' +
    '</body></html>'
  ));
  app.use((_req, res) => res.type('html').send(
    '<html><body style="font-family:system-ui;padding:4rem;text-align:center">' +
    '<h2>Build en cours</h2><p>Rafraîchir bientôt ⏳</p></body></html>'
  ));
}

if (require.main === module && typeof app && typeof app.listen === 'function') {
  const PORT = process.env.PORT || 5000;
  const isProduction = (process.env.NODE_ENV !== 'development');
  const URL = process.env.APP_URL || `http://localhost:${PORT}`;

  app.listen(PORT, () => {
    console.log('=======================================================');
    console.log('🚗 Hertz Digital Rental Platform');
    console.log('🌍 Environnement :', isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT');
    console.log('📡 URL           :', URL);
    console.log('🔌 Port          :', PORT);
    console.log('⚡ Statut        : En ligne ✅');
    console.log('=======================================================');
  });
} else {
  module.exports = app;
}
