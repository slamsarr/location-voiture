"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.generateToken = generateToken;
exports.validateToken = validateToken;
exports.authMiddleware = authMiddleware;
exports.adminOnlyMiddleware = adminOnlyMiddleware;
exports.clientOnlyMiddleware = clientOnlyMiddleware;
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const DEFAULT_DEV_SECRET = 'hertz-dev-secret-change-me-in-production-do-not-use-this-0123456789abcdef';
const rawSecret = process.env.JWT_SECRET || '';
const isProduction = process.env.NODE_ENV === 'production';
if (!rawSecret && isProduction) {
    console.error('====================================================================');
    console.error('❌ [ERREUR CRITIQUE PRODUCTION] JWT_SECRET est ABSENT des variables');
    console.error('   d\'environnement. Les utilisateurs seront déconnectés à chaque');
    console.error('   redémarrage ! Ajoutez JWT_SECRET dans votre fichier .env .');
    console.error('====================================================================');
}
if (!rawSecret) {
    console.warn('⚠️  [AVERTISSEMENT] Aucun JWT_SECRET défini — utilisation du secret DEV par défaut.');
    console.warn('    Pour la production, définissez JWT_SECRET avec une chaîne aléatoire de 64+ caractères.');
}
const JWT_SECRET = rawSecret || DEFAULT_DEV_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;
async function hashPassword(plainPassword) {
    return bcryptjs_1.default.hash(plainPassword, SALT_ROUNDS);
}
async function verifyPassword(plainPassword, hashedPassword) {
    return bcryptjs_1.default.compare(plainPassword, hashedPassword);
}
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256',
        issuer: 'hertz-digital-rental',
    });
}
function validateToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: 'hertz-digital-rental',
        });
    }
    catch {
        return null;
    }
}
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authentification requise. Token manquant.' });
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Format token invalide. Utilisez "Bearer <token>".' });
        }
        const decoded = validateToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Token invalide ou expiré.' });
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
        };
        next();
    }
    catch (error) {
        return res.status(500).json({ error: 'Erreur d’authentification interne.' });
    }
}
function adminOnlyMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise.' });
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Accès refusé. Rôle administrateur requis.' });
    }
    next();
}
function clientOnlyMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise.' });
    }
    if (req.user.role !== 'CLIENT' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Accès refusé.' });
    }
    next();
}
function validateBody(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                const errors = err.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                return res.status(400).json({
                    error: 'Données de requête invalides',
                    details: errors,
                });
            }
            return res.status(400).json({ error: 'Requête invalide.' });
        }
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                const errors = err.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                return res.status(400).json({
                    error: 'Paramètres de requête invalides',
                    details: errors,
                });
            }
            return res.status(400).json({ error: 'Requête invalide.' });
        }
    };
}
