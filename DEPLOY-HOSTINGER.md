# 🚀 Guide Déploiement Hostinger — Hertz Digital Rental Platform

> **Dernière mise à jour** : Octobre 2026
> **Prérequis** : Un compte Hostinger actif + votre nom de domaine configuré.

---

## 📋 Sommaire

- [**OPTION A** : Déploiement via hPanel (Node.js App — Le plus simple)](#option-a--déploiement-via-hpanel-nodejs-app--le-plus-simple)
- [**OPTION B** : Déploiement VPS / Cloud via SSH (Recommandé pour la robustesse)](#option-b--déploiement-vps--cloud-via-ssh-recommandé-pour-la-robustesse)
- [3. Connexion Nom de Domaine & SSL (HTTPS)](#3-connexion-nom-de-domaine--ssl-https)
- [4. Commandes d'Administration Quotidienne](#4-commandes-dadministration-quotidienne)
- [5. FAQ & Dépannage](#5-faq--dépannage)

---

## 🏗️ OPTION A : Déploiement via hPanel (Node.js App — Le plus simple)

> ✅ **Idéal si** : Vous avez un plan d'hébergement **Web Hosting (Premium/Entreprise)** Hostinger avec support Node.js.  
> ❌ **Limites** : Pas de PM2, redémarrage manuel parfois requis, SQLite OK mais PostgreSQL conseillé.

### Étape A.1 — Préparer le projet en local (sur votre PC)

Sur votre machine Windows/Mac :

```bash
cd "location de voiture"

# 1. Nettoyer et installer les dépendances PROPREMENT
rm -rf backend/node_modules frontend/node_modules node_modules 2>/dev/null
rm -rf backend/dist 2>/dev/null
npm install --prefix backend
npm install --prefix frontend
npm install

# 2. Générer le build (frontend + backend)
# Sur Windows :
npm run build:windows
# Sur Mac/Linux :
npm run build
```

Vous devez obtenir la structure suivante :
```
backend/dist/
├── server.js               ← Point d'entrée Node
├── prisma/
│   └── schema.prisma
├── public/                 ← Frontend buildé (généré par Vite)
│   ├── index.html
│   └── assets/
├── controllers/
├── services/
└── ...
```

### Étape A.2 — Créer l'archive ZIP à uploader

À la racine du projet **sur votre machine**, sélectionnez ces fichiers/dossiers uniquement et ajoutez-les dans un ZIP nommé `hertz-deploy.zip` :

```
✅ backend/dist/            (tout le dossier)
✅ backend/package.json
✅ backend/package-lock.json
✅ backend/src/prisma/schema.prisma
✅ backend/ecosystem.config.js
✅ backend/.env             (copié depuis .env.example et REMPLI)
```

> ⚠️ **Important** : Avant de zipper, préparez votre fichier `backend/.env` à partir du modèle `.env.example` — N'OUBLIEZ PAS de **générer un JWT_SECRET fort** et de définir `NODE_ENV=production`.

### Étape A.3 — Uploader sur Hostinger via Gestionnaire de Fichiers

1. Rendez-vous sur : https://hpanel.hostinger.com/
2. Cliquez sur **Hébergements** → Sélectionnez votre plan → **Gérer**
3. Dans le menu gauche : **Fichiers** → **Gestionnaire de fichiers**
4. Naviguez vers le dossier racine de votre domaine : `public_html` OU si vous voulez un sous-domaine ex : `location.votre-domaine.com`, créez ce dossier.
5. Créez un sous-dossier `app/` dans le dossier cible.
6. Uploader `hertz-deploy.zip` et **Décompressez** son contenu dans le dossier `app/`.

Vous devez avoir :
```
public_html/app/
├── dist/
├── prisma/schema.prisma
├── package.json
├── package-lock.json
├── ecosystem.config.js
└── .env
```

### Étape A.4 — Créer l'Application Node.js dans hPanel

1. Retour sur hPanel → **Avancé** → **Node.js**
2. Cliquez sur **Créer une nouvelle application** (bleu)
3. Renseignez :
   - **Nom de l'application** : `Hertz Location Voiture`
   - **Domaine d'application** : choisissez `(www.)votre-domaine.com` OU votre sous-domaine
   - **Dossier d'application** : cliquez sur l'icône dossier → choisissez `public_html/app` (ou le chemin que vous avez créé)
   - **Fichier de démarrage** : `dist/server.js`
   - **Version Node.js** : choisissez **Node 20.x (LTS)** ou minimum 18.x
   - **Mode d'environnement** : `Production`
4. Cliquez sur **Créer une application**

Hostinger va installer les dépendances automatiquement. ⏱️ Attendez 2 à 5 minutes.

### Étape A.5 — Initialiser la base de données (Prisma + Seed)

Retournez dans `Node.js` → cliquez sur **...** à côté de votre app → **Terminal (SSH)**.

Si SSH n'est pas activé, activez-le d'abord (hPanel → Avancé → SSH).

Une fois dans le terminal :

```bash
cd public_html/app    # ou votre chemin

# 1. Générer le client Prisma
npx prisma generate --schema=dist/prisma/schema.prisma

# 2. Créer les tables dans la BDD
npx prisma db push --schema=dist/prisma/schema.prisma

# 3. Insérer les données de démo (véhicules, clients, réservations...)
cp -r dist/prisma/* /tmp/prisma_tmp/ 2>/dev/null
cd ../.. && cd public_html/app
# Si seed.js existe :
node dist/prisma/seed.js 2>/dev/null || echo "(seed ts — ignorable si SQLite OK)"
```

> ⚠️ Si la base SQLite ne se crée pas automatiquement :
> ```bash
> touch dist/prisma/prod.db
> chmod 666 dist/prisma/prod.db
> ```

### Étape A.6 — Vérifier !

Ouvrez votre navigateur et rendez-vous sur :
- ✅ `https://votre-domaine.com/api/health` → Doit afficher `{"status":"healthy"...}`
- ✅ `https://votre-domaine.com/` → Doit afficher l'accueil Hertz Digital

Si les deux routes fonctionnent → **Bravo 🎉 ! L'application est en ligne !**

---

## 🏆 OPTION B : Déploiement VPS / Cloud via SSH (Recommandé)

> ✅ **Recommandé pour** : Plans **Hostinger VPS**, **Cloud Hosting**, ou serveur Ubuntu/Debian.  
> ✅ **Avantages** : Gestion PM2 complète, redémarrage auto, logs persistants, SSL Let's Encrypt, performances supérieures.

### Étape B.1 — Préparer le serveur VPS Hostinger

Depuis le hPanel de votre VPS :
1. Installez un OS **Ubuntu 22.04 LTS (Jammy Jellyfish)** ou 24.04 LTS.
2. Notez :
   - **Adresse IP VPS** (ex: `185.200.xxx.xxx`)
   - **Mot de passe root**
3. Allez dans **Pare-feu** et OUVREZ ces ports : `22 (SSH)`, `80 (HTTP)`, `443 (HTTPS)`, `5000`

### Étape B.2 — Se connecter en SSH

Sur votre PC :
```bash
# Windows : utiliser PowerShell, Terminal ou Git Bash
# Mac/Linux : Terminal natif
ssh root@185.200.xxx.xxx
# Entrez le mot de passe root
```

### Étape B.3 — Installer le socle logiciel

Dans le terminal SSH, exécutez ces commandes une par une :

```bash
# 1. Mettre à jour le système
apt update -y && apt upgrade -y

# 2. Installer Node.js 20.x LTS (via NodeSource — officiel)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Vérifier versions
node -v      # Doit afficher v20.x.x
npm -v       # Doit afficher 10.x.x

# 3. Installer PM2 (gestionnaire de process Node)
npm install -g pm2

# Vérifier PM2
pm2 --version

# 4. Installer Nginx (reverse proxy + SSL)
apt install -y nginx

# 5. Vérifier UFW (pare-feu)
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

### Étape B.4 — Cloner ou uploader le projet

**Méthode 1 (Recommandée) — Cloner depuis Git (GitHub/GitLab)** :

```bash
# Sur votre machine locale : d'abord pousser le code sur GitHub.
# Puis sur le VPS :
cd /var/www
git clone https://github.com/VOTRE-USERNAME/location-voiture.git hertz
cd hertz
```

**Méthode 2 — Uploader par SCP (si pas Git)** :

Sur votre machine locale, dans un NOUVEAU terminal :
```bash
cd "location de voiture"
scp -r backend root@185.200.xxx.xxx:/var/www/hertz/
scp -r frontend root@185.200.xxx.xxx:/var/www/hertz/
scp package.json .gitignore .env.example root@185.200.xxx.xxx:/var/www/hertz/
```

Puis retourner sur le VPS :
```bash
cd /var/www/hertz
chown -R www-data:www-data /var/www/hertz
```

### Étape B.5 — Installer dépendances et construire le projet

Sur le VPS :

```bash
cd /var/www/hertz

# Installer dépendances racine + backend + frontend
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Générer le build production
npm run build

# Copier le .env de production dans backend/
cp .env.example backend/.env
nano backend/.env
# ------- Dans l'éditeur nano -------
#   NODE_ENV=production
#   PORT=5000
#   APP_URL=https://votre-domaine.tdl
#   JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (générez un secret fort)
#   DATABASE_URL="file:./dist/prisma/prod.db"
#   Enregistrez : Ctrl+O → Entrée → Ctrl+X
```

### Étape B.6 — Initialiser la BDD et lancer avec PM2

```bash
cd /var/www/hertz/backend

# Créer dossier logs
mkdir -p logs

# Générer Prisma Client & créer tables
npm run prisma:push

# (Optionnel mais recommandé) Insérer les données de démo
npx ts-node src/prisma/seed.ts 2>/dev/null || echo "(seed ignoré si TS pas global)"

# ─── LANCER AVEC PM2 ───
# Option 1 : directement
NODE_ENV=production PORT=5000 pm2 start dist/server.js --name hertz-rental

# Option 2 : via ecosystem.config.js (RECOMMANDÉ)
pm2 start ecosystem.config.js

# Persister le process PM2 (démarrage AUTOMATIQUE au reboot serveur)
pm2 save
pm2 startup systemd
# Exécutez la commande qui s'affiche (commence par "sudo env PATH=...")

# Vérifier le statut
pm2 status
pm2 logs hertz-rental --lines 50
```

Vérifier que l'app répond en local sur le VPS :
```bash
curl -s http://localhost:5000/api/health
# Doit retourner {"status":"healthy", ...}
```

### Étape B.7 — Configurer Nginx (Reverse Proxy + Domaine)

```bash
# Créer le fichier de configuration
nano /etc/nginx/sites-available/hertz-rental
```

Collez ce contenu (remplacez `votre-domaine.tdl` par votre vrai domaine) :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.tdl www.votre-domaine.tdl;

    # Taille max upload — utile pour images inspection véhicule
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

Activez le site et testez :
```bash
ln -s /etc/nginx/sites-available/hertz-rental /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Vérifier que la syntaxe Nginx est OK
nginx -t
# ← Doit afficher "syntax is ok" + "test is successful"

# Recharger Nginx
systemctl reload nginx
systemctl status nginx
```

### Étape B.8 — Installer le SSL Gratuit (HTTPS Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx

certbot --nginx -d votre-domaine.tdl -d www.votre-domaine.tdl
# Suivez les questions : votre email → Accepter → (N)o spam → (2) Redirect
```

Testez : `https://votre-domaine.tdl/api/health` puis `https://votre-domaine.tdl/`

🎉 **Votre application est en ligne, sécurisée et redémarre automatiquement !**

---

## 🌐 3. Connexion Nom de Domaine & DNS

Depuis Hostinger hPanel → **Domaines** → Sélectionnez votre domaine → **Gérer** → **DNS / Zone Editor**.

Si votre domaine est **sur un VPS Hostinger**, ajoutez ces 2 enregistrements :

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| **A** | `@` | `IP_DE_VOTRE_VPS` | 14400 |
| **A** | `www` | `IP_DE_VOTRE_VPS` | 14400 |
| *(Optionnel Sous-domaine)* | **A** | `location` | `IP_DE_VOTRE_VPS` | 14400 |

Attendez **propagation DNS : 5 min à 24 heures**. Vérifiez sur : https://dnschecker.org/

---

## 🔧 4. Commandes d'Administration Quotidienne

| Action | Commande (SSH VPS) |
|--------|--------------------|
| **Voir statut app** | `pm2 status` |
| **Voir logs en direct** | `pm2 logs hertz-rental` |
| **Redémarrer l'app** | `pm2 restart hertz-rental` |
| **Arrêter l'app** | `pm2 stop hertz-rental` |
| **Mettre à jour le code (Git)** | `cd /var/www/hertz && git pull && npm run build && pm2 restart hertz-rental` |
| **Voir infos système** | `htop` ou `free -h` |
| **Relancer Nginx** | `systemctl restart nginx` |
| **Renouveler SSL auto** | `certbot renew --dry-run` (Let's Encrypt le fait automatiquement) |
| **Sauvegarder la BDD SQLite** | `cp backend/dist/prisma/prod.db backup-$(date +%Y%m%d).db` |

---

## ❓ 5. FAQ & Dépannage

### ❌ Problème : Page blanche / "Cannot GET /"
→ C'est que le build frontend n'a pas été trouvé par Express. Vérifiez :
```bash
ls -la /var/www/hertz/backend/dist/public/index.html
# Si absent : cd frontend && npm run build
```

### ❌ Problème : Erreur 502 Bad Gateway (Nginx)
→ PM2 a crashé ou Node n'a pas démarré. Vérifiez :
```bash
pm2 status
pm2 logs hertz-rental --lines 200
```
→ Souvent un `JWT_SECRET` manquant ou une BDD SQLite avec droits incorrects.

### ❌ Problème : Erreur CORS en production
→ Vérifiez la variable `ALLOWED_ORIGINS` dans `.env`. Pour tester, laissez `ALLOWED_ORIGINS=*`.

### ❌ Problème : Permission SQLite
```bash
chown -R www-data:www-data /var/www/hertz/backend/dist/prisma
chmod -R 775 /var/www/hertz/backend/dist/prisma
```

### ❌ Problème : Les emails/SMS ne s'envoient pas
→ C'est NORMAL en mode démo, les providers ne sont pas configurés. Renseignez SMTP_HOST/SMS_API_KEY dans `.env`.

### 💡 Astuce sécurité : Migrer SQLite → PostgreSQL
Sur Hostinger, depuis hPanel → **Bases de données** → **PostgreSQL** → Créer. Puis modifiez `backend/.env` :
```
DATABASE_URL="postgresql://USER_NOM:MOT_DE_PASSE@localhost:5432/NOM_BASE?schema=public"
```
Relancez :
```bash
cd backend
npx prisma db push
pm2 restart hertz-rental
```

---

## 📞 Besoin d'aide ?

Si vous bloquez à une étape, collectez ces infos avant de contacter un développeur :
1. Votre plan Hostinger exact (Web Hosting / VPS / Cloud)
2. La sortie de `pm2 status`
3. La sortie de `pm2 logs hertz-rental --lines 100`
4. La sortie de `curl -s http://localhost:5000/api/health`
5. Une capture d'écran de l'erreur dans le navigateur (onglet Network + Console DevTools F12)

---

**Bon déploiement 🚗💨 !**
