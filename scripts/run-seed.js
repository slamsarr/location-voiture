const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.resolve(__dirname, '..', 'backend');
const seedJs = path.join(backendDir, 'dist', 'prisma', 'seed.js');

try {
  if (fs.existsSync(seedJs)) {
    execSync('node dist/prisma/seed.js', { cwd: backendDir, stdio: 'inherit' });
    process.exit(0);
  }
  console.log('⚠️  Seed dist/prisma/seed.js introuvable — tentative ts-node');
  execSync('npx ts-node --project tsconfig.json src/prisma/seed.ts', { cwd: backendDir, stdio: 'inherit' });
} catch (err) {
  console.warn('⚠️  Seed non exécuté (ignoré) :', err?.message || String(err));
  process.exit(0);
}
