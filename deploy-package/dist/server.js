"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*').split(',');
// Middlewares
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (isProduction) {
            if (!origin || ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Origine non autorisée par la politique CORS'));
            }
        }
        else {
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Logging basique des requêtes
app.use((req, res, next) => {
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
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        platform: 'Hertz Digital Rental Platform',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});
// Montage de l'API
app.use('/api', api_routes_1.default);
// ----- En production : servir le frontend buildé depuis /dist/public -----
if (isProduction) {
    const publicDir = path_1.default.join(__dirname, 'public');
    if (fs_1.default.existsSync(publicDir)) {
        // Servir les assets statiques
        app.use(express_1.default.static(publicDir, {
            maxAge: '1y',
            etag: true,
            index: false,
        }));
        // Gestion du routing SPA : pour toutes les autres routes, renvoyer index.html
        app.get(/^\/(?!api\/).*/, (req, res) => {
            const indexPath = path_1.default.join(publicDir, 'index.html');
            if (fs_1.default.existsSync(indexPath)) {
                res.sendFile(indexPath);
            }
            else {
                res.status(404).json({ error: 'Application frontend non trouvée. Build manquant.' });
            }
        });
    }
    else {
        console.warn('⚠️  [Production] Dossier public introuvable :', publicDir);
        console.warn('⚠️  Exécutez "npm run build" depuis la racine pour générer le build frontend.');
    }
}
// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
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
    }
    else {
        console.log(`🎨 Frontend      : http://localhost:5173 (Vite dev)`);
    }
    console.log(`⚡ Statut        : En ligne ✅`);
    console.log(`=======================================================`);
});
exports.default = app;
