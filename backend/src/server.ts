import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*').split(',');

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (isProduction) {
      if (!origin || ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origine non autorisée par la politique CORS'));
      }
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging basique des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/api/health')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Route de santé
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'Hertz Digital Rental Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Montage de l'API
app.use('/api', apiRouter);

// ----- En production : servir le frontend buildé depuis /dist/public -----
if (isProduction) {
  const publicDir = path.join(__dirname, 'public');
  
  if (fs.existsSync(publicDir)) {
    // Servir les assets statiques
    app.use(express.static(publicDir, {
      maxAge: '1y',
      etag: true,
      index: false,
    }));

    // Gestion du routing SPA : pour toutes les autres routes, renvoyer index.html
    app.get(/^\/(?!api\/).*/, (req: Request, res: Response) => {
      const indexPath = path.join(publicDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: 'Application frontend non trouvée. Build manquant.' });
      }
    });
  } else {
    console.warn('⚠️  [Production] Dossier public introuvable :', publicDir);
    console.warn('⚠️  Exécutez "npm run build" depuis la racine pour générer le build frontend.');
  }
}

// Gestionnaire d'erreurs global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur Serveur Non interceptée :', err);
  res.status(err.status || 500).json({
    error: err.message || 'Une erreur interne est survenue sur le serveur.',
    details: isProduction ? undefined : err.stack
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  const url = process.env.APP_URL || `http://localhost:${PORT}`;
  console.log(`=======================================================`);
  console.log(`🚗 Hertz Digital Rental Platform`);
  console.log(`🌍 Environnement : ${isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT'}`);
  console.log(`📡 URL           : ${url}`);
  console.log(`🔌 Port          : ${PORT}`);
  if (isProduction) {
    console.log(`🎨 Frontend      : Intégré (servi par Node.js)`);
  } else {
    console.log(`🎨 Frontend      : http://localhost:5173 (Vite dev)`);
  }
  console.log(`⚡ Statut        : En ligne ✅`);
  console.log(`=======================================================`);
});

export default app;
