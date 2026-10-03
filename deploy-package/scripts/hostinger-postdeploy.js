#!/usr/bin/env node
/**
 * Script de POST-DÉPLOIEMENT Hostinger — À exécuter après npm install sur le serveur
 * Usage : node scripts/hostinger-postdeploy.js
 * 
 * Ce script :
 * 1. Génère le client Prisma
 * 2. Applique le schéma à la BDD (db push)
 * 3. Lance le seed de démonstration (si BDD vide)
 * 4. Crée les dossiers logs/ et les fichiers de droits SQLite
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const BACKEND = path.join(ROOT, 'backend');
const DEPLOY_PKG = path.join(ROOT, 'deploy-package');

function detectBackendDir() {
  if (fs.existsSync(path.join(BACKEND, 'dist', 'server.js'))) return BACKEND;
  if (fs.existsSync(path.join(DEPLOY_PKG, 'dist', 'server.js'))) return DEPLOY_PKG;
  if (fs.existsSync(path.join(ROOT, 'dist', 'server.js'))) return ROOT;
  return BACKEND;
}

function run(cmd, cwd) {
  console.log(`\n▶️  ${cmd}`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit', timeout: 120000 });
    return true;
  } catch (err) {
    console.error(`❌ Échec (non bloquant) : ${err?.message || err}`);
    return false;
  }
}

function main() {
  console.log('==========================================================');
  console.log('🚀 Hertz Digital — Script Post-Déploiement Hostinger');
  console.log('==========================================================');

  const backendDir = detectBackendDir();
  console.log(`\n📂 Dossier backend détecté : ${backendDir}`);

  const schemaPath = fs.existsSync(path.join(backendDir, 'dist', 'prisma', 'schema.prisma'))
    ? 'dist/prisma/schema.prisma'
    : (fs.existsSync(path.join(backendDir, 'src', 'prisma', 'schema.prisma'))
        ? 'src/prisma/schema.prisma'
        : 'prisma/schema.prisma');

  console.log(`📋 Schéma Prisma : ${schemaPath}`);
  console.log(`🔧 NODE_ENV = ${process.env.NODE_ENV || 'non défini (défaut: development)'}`);

  // Étape 1 : Prisma Generate
  console.log('\n--- Étape 1/3 : Génération Prisma Client ---');
  run(`npx prisma generate --schema=${schemaPath}`, backendDir);

  // Étape 2 : Prisma DB Push
  console.log('\n--- Étape 2/3 : Application schéma BDD (db push) ---');
  run(`npx prisma db push --schema=${schemaPath} --skip-generate`, backendDir);

  // Étape 3 : Seed (si disponible)
  console.log('\n--- Étape 3/3 : Seed de démonstration ---');
  const seedDist = path.join(backendDir, 'dist', 'prisma', 'seed.js');
  const seedSrc = path.join(backendDir, 'src', 'prisma', 'seed.ts');
  if (fs.existsSync(seedDist)) {
    run('node dist/prisma/seed.js', backendDir);
  } else if (fs.existsSync(seedSrc)) {
    run('npx ts-node --project tsconfig.json src/prisma/seed.ts', backendDir);
  } else {
    console.log('ℹ️  Aucun fichier seed trouvé — étape ignorée.');
  }

  // Étape 4 : Vérifications / droits SQLite
  try {
    const prismaDir = path.join(backendDir, 'dist', 'prisma');
    if (fs.existsSync(prismaDir)) {
      const dbFile = path.join(prismaDir, 'prod.db');
      if (!fs.existsSync(dbFile)) {
        fs.closeSync(fs.openSync(dbFile, 'w'));
        console.log('✅ Fichier SQLite prod.db créé.');
      }
      try { fs.chmodSync(dbFile, 0o666); } catch (_) {}
      try { fs.chmodSync(prismaDir, 0o775); } catch (_) {}
    }
  } catch (_) {}

  // Étape 5 : Créer dossier logs
  try {
    const logsDir = path.join(backendDir, 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  } catch (_) {}

  console.log('\n==========================================================');
  console.log('✅ Post-déploiement terminé !');
  console.log('');
  console.log('👉 Identifiants de démo (si seed exécuté) :');
  console.log('   Admin  : admin@demo.local / Admin123!');
  console.log('   Client : client@demo.local / Client123!');
  console.log('');
  console.log('👉 Vérification santé :');
  console.log('   curl http://localhost:5000/api/health');
  console.log('==========================================================');
}

main();
