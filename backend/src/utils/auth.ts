import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'CLIENT' | 'ADMIN' | string;
    name: string;
  };
}

const DEFAULT_DEV_SECRET = 'hertz-dev-secret-change-me-in-production-do-not-use-this-0123456789abcdef';
const rawSecret = (process.env.JWT_SECRET as string) || '';
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

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(payload: {
  id: string;
  email: string;
  role: string;
  name: string;
}): string {
  return jwt.sign(
    payload,
    JWT_SECRET as jwt.Secret,
    {
      expiresIn: JWT_EXPIRES_IN as any,
      algorithm: 'HS256',
      issuer: 'hertz-digital-rental',
    }
  );
}

export function validateToken(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret, {
      algorithms: ['HS256'],
      issuer: 'hertz-digital-rental',
    });
  } catch {
    return null;
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
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
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur d’authentification interne.' });
  }
}

export function adminOnlyMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès refusé. Rôle administrateur requis.' });
  }
  next();
}

export function clientOnlyMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }
  if (req.user.role !== 'CLIENT' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  next();
}

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
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

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
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
