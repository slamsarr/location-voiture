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

const path = require('path');
const fs = require('fs');

// Résolution universelle des node_modules (Hostinger racine + sous-dossiers)
const candidateModules = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, 'backend', 'node_modules'),
  path.join(__dirname, 'deploy-package', 'node_modules'),
];
for (const dir of candidateModules) {
  if (fs.existsSync(dir) && module.paths && !module.paths.includes(dir)) {
    module.paths.unshift(dir);
  }
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Auto-configuration Prisma BDD (PostgreSQL/Supabase vs SQLite)
(function autoConfigureDatabase() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  const backendDir = path.join(__dirname, 'backend');

  if (isPostgres) {
    const pgSchema = path.join(backendDir, 'src', 'prisma', 'schema.postgresql.prisma');
    const targetSchema = path.join(backendDir, 'src', 'prisma', 'schema.prisma');
    const distSchema = path.join(backendDir, 'dist', 'prisma', 'schema.prisma');

    if (fs.existsSync(pgSchema)) {
      try {
        const pgContent = fs.readFileSync(pgSchema, 'utf8');
        let needsRegen = false;

        if (!fs.existsSync(targetSchema) || fs.readFileSync(targetSchema, 'utf8') !== pgContent) {
          fs.writeFileSync(targetSchema, pgContent, 'utf8');
          needsRegen = true;
        }
        if (fs.existsSync(path.dirname(distSchema))) {
          if (!fs.existsSync(distSchema) || fs.readFileSync(distSchema, 'utf8') !== pgContent) {
            fs.writeFileSync(distSchema, pgContent, 'utf8');
            needsRegen = true;
          }
        }

        const clientSchema = path.join(backendDir, 'node_modules', '.prisma', 'client', 'schema.prisma');
        if (fs.existsSync(clientSchema)) {
          const cs = fs.readFileSync(clientSchema, 'utf8');
          if (!cs.includes('provider = "postgresql"')) {
            needsRegen = true;
          }
        } else {
          needsRegen = true;
        }

        if (needsRegen) {
          console.log('🐘 PostgreSQL/Supabase détecté — regénération Prisma Client...');
          const { execSync } = require('child_process');
          execSync(`npx prisma generate --schema="${pgSchema}"`, { cwd: backendDir, stdio: 'inherit', timeout: 35000 });
          console.log('✅ Prisma Client PostgreSQL synchronisé !');
        }
      } catch (err) {
        console.warn('⚠️ Auto-config Prisma PostgreSQL :', err.message);
      }
    }
  } else if (!dbUrl) {
    const defaultDb = path.join(backendDir, 'dev.db');
    process.env.DATABASE_URL = `file:${defaultDb}`;
  }
})();

const CANDIDATE_BUILDS = [
  path.join(__dirname, 'backend', 'dist', 'server.js'),
  path.join(__dirname, 'deploy-package', 'dist', 'server.js'),
  path.join(__dirname, 'dist', 'server.js'),
];
const FALLBACK_PATH = path.join(__dirname, 'backend', 'server.js');

let app = null;
const foundBuild = CANDIDATE_BUILDS.find(p => fs.existsSync(p));

if (foundBuild) {
  const built = require(foundBuild);
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

module.exports = app;

if (require.main === module && app && typeof app.listen === 'function') {
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
}

