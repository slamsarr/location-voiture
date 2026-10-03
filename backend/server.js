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

const path = require('path');
const fs = require('fs');

// Résolution universelle des node_modules
const candidateModules = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, '..', 'node_modules'),
  path.join(__dirname, '..', 'backend', 'node_modules'),
];
for (const dir of candidateModules) {
  if (fs.existsSync(dir) && module.paths && !module.paths.includes(dir)) {
    module.paths.unshift(dir);
  }
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Auto-configuration Prisma BDD (PostgreSQL/Supabase vs SQLite)
(function autoConfigureDatabase() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  const backendDir = __dirname;

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

module.exports = app;

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
}

