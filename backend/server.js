/**
 * Hertz Digital Rental Platform - Fallback Backend Entry Point
 *
 * Hostinger recherche explicitement backend/server.js comme point
 * d'entrée alternatif (voir son diagnostic). Ce fichier utilise un
 * require() STATIQUE vers ./dist/server.js pour que l'analyseur
 * statique de Hostinger détecte bien les server dependencies.
 *
 * Comportement adaptatif :
 *   - require()       → exporte Express app (détection)
 *   - node server.js  → démarre listen (démarrage réel)
 *   - build absent    → fallback express minimal sans plantage
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const CANDIDATE_BUILDS = [
  path.join(__dirname, 'dist', 'server.js'),
  path.join(__dirname, '..', 'deploy-package', 'dist', 'server.js'),
  path.join(__dirname, '..', 'dist', 'server.js'),
  path.join(__dirname, '..', 'backend', 'dist', 'server.js'),
];
let app = null;
const foundBuild = CANDIDATE_BUILDS.find(p => fs.existsSync(p));

if (foundBuild) {
  const built = require(foundBuild);
  app = (built && built.default) ? built.default : built;
} else {
  console.warn('============================================================');
  console.warn('⚠️  [PRE-BUILD] backend/dist/server.js introuvable');
  console.warn('      — Phase de détection Hostinger normale.');
  console.warn('      Le build génère backend/dist/server.js automatiquement');
  console.warn('============================================================');
  app = express();
  app.use(cors());
  app.get('/api/health', (_req, res) => res.status(200).json({
    status: 'pre-build',
    message: 'Build en cours, rafraîchir dans 30s.'
  }));
  app.use((_req, res) => res.type('html').send(
    '<html><body style="font-family:system-ui;padding:4rem;text-align:center">' +
    '<h2>⏳ Build backend en cours...</h2></body></html>'
  ));
}

if (require.main === module && typeof app === 'function' && typeof app.listen === 'function') {
  const PORT = process.env.PORT || 5000;
  const isProduction = (process.env.NODE_ENV !== 'development');
  const URL = process.env.APP_URL || `http://localhost:${PORT}`;

  app.listen(PORT, () => {
    console.log('=======================================================');
    console.log('🚗 Hertz Digital Rental Platform (backend/server.js)');
    console.log('🌍 Environnement :', isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT');
    console.log('📡 URL           :', URL);
    console.log('🔌 Port          :', PORT);
    console.log('⚡ Statut        : En ligne ✅');
    console.log('=======================================================');
  });
} else {
  module.exports = app;
}
