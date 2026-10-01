const fs = require('fs');
const path = require('path');

const root = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const src = path.resolve(root, 'frontend', 'dist');
const dest = path.resolve(root, 'backend', 'dist', 'public');

if (!fs.existsSync(src)) {
  console.warn('⚠️  frontend/dist introuvable — build frontend d\'abord.');
  process.exit(0);
}

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

function copyRecursive(s, d) {
  const stat = fs.statSync(s);
  if (stat.isDirectory()) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    for (const f of fs.readdirSync(s)) {
      copyRecursive(path.join(s, f), path.join(d, f));
    }
  } else {
    fs.copyFileSync(s, d);
  }
}

copyRecursive(src, dest);
console.log('✅ Frontend copié vers backend/dist/public');
