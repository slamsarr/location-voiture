"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
dotenv_1.default.config({
    path: [
        path_1.default.resolve(process.cwd(), '.env'),
        path_1.default.resolve(__dirname, '../../.env'),
        path_1.default.resolve(__dirname, '../.env'),
    ].filter(p => fs_1.default.existsSync(p)),
});
const resolveDatabaseUrlFromEnv = (callerDirname) => {
    const raw = process.env.DATABASE_URL;
    if (!raw) {
        const defaultDb = path_1.default.resolve(callerDirname, '..', 'dev.db');
        process.env.DATABASE_URL = `file:${defaultDb}`;
        return process.env.DATABASE_URL;
    }
    const match = raw.match(/^file:(.+)$/);
    if (!match)
        return raw;
    let dbRelPath = match[1];
    if (path_1.default.isAbsolute(dbRelPath))
        return raw;
    dbRelPath = dbRelPath.replace(/^\.\//, '');
    const serverDir = callerDirname;
    const backendRootDir = path_1.default.resolve(serverDir, '..');
    const abs = path_1.default.resolve(backendRootDir, dbRelPath);
    const dir = path_1.default.dirname(abs);
    try {
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
    }
    catch (_err) { /* ignore */ }
    process.env.DATABASE_URL = `file:${abs}`;
    return process.env.DATABASE_URL;
};
resolveDatabaseUrlFromEnv(__dirname);
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
// Route de santé avec diagnostic BDD
app.get('/api/health', async (req, res) => {
    let dbStatus = 'unknown';
    let dbError = null;
    let vehicleCount = 0;
    let userCount = 0;
    try {
        const { prisma } = await Promise.resolve().then(() => __importStar(require('./utils/prisma')));
        vehicleCount = await prisma.vehicle.count();
        userCount = await prisma.user.count();
        dbStatus = 'connected';
    }
    catch (err) {
        dbStatus = 'error';
        dbError = err?.message || String(err);
    }
    res.json({
        status: dbStatus === 'connected' ? 'healthy' : 'degraded',
        database: {
            status: dbStatus,
            error: dbError,
            vehicleCount,
            userCount,
            hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
            dbProtocol: (process.env.DATABASE_URL || '').split(':')[0],
        },
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
// Démarrage du serveur UNIQUEMENT si ce fichier est exécuté directement
// (pas quand il est require() par un server.js parent - sinon double listen EADDRINUSE
// pendant la phase de détection Hostinger).
if (require.main === module) {
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
}
exports.default = app;
