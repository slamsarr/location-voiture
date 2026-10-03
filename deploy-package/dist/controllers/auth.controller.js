"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = require("../utils/prisma");
const auth_1 = require("../utils/auth");
const isProduction = process.env.NODE_ENV === 'production';
function serverError(res, error) {
    console.error('[AuthController]', error);
    return res.status(500).json({
        error: isProduction ? 'Une erreur interne est survenue.' : error.message,
    });
}
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email et mot de passe requis.' });
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { email: email.toLowerCase() },
                include: { customers: true }
            });
            if (!user) {
                return res.status(401).json({ error: 'Identifiants invalides.' });
            }
            const isValid = await (0, auth_1.verifyPassword)(password, user.passwordHash);
            if (!isValid) {
                return res.status(401).json({ error: 'Mot de passe incorrect.' });
            }
            const token = (0, auth_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            });
            return res.json({
                token,
                tokenType: 'Bearer',
                expiresIn: '7d',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                    customer: user.customers
                }
            });
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async register(req, res) {
        try {
            const { name, email, password, phone } = req.body;
            const existing = await prisma_1.prisma.user.findUnique({
                where: { email: email.toLowerCase() }
            });
            if (existing) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
            }
            const hashedPassword = await (0, auth_1.hashPassword)(password);
            const user = await prisma_1.prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    passwordHash: hashedPassword,
                    name,
                    phone,
                    role: 'CLIENT',
                }
            });
            const token = (0, auth_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            });
            return res.status(201).json({
                token,
                tokenType: 'Bearer',
                expiresIn: '7d',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    phone: user.phone
                }
            });
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async demoLogin(req, res) {
        try {
            const { role } = req.body;
            const email = role === 'ADMIN' ? 'admin@demo.local' : 'client@demo.local';
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
                include: { customers: true }
            });
            if (!user) {
                return res.status(404).json({ error: 'Compte démo introuvable. Lancez `npm run seed` pour initialiser la base.' });
            }
            const token = (0, auth_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            });
            return res.json({
                token,
                tokenType: 'Bearer',
                expiresIn: '7d',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                    customer: user.customers
                }
            });
        }
        catch (error) {
            return serverError(res, error);
        }
    }
    static async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Non authentifié.' });
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: req.user.id },
                include: { customers: true }
            });
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur introuvable.' });
            }
            return res.json({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                customer: user.customers
            });
        }
        catch (error) {
            return serverError(res, error);
        }
    }
}
exports.AuthController = AuthController;
