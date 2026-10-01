import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken, AuthRequest } from '../utils/auth';

const prisma = new PrismaClient();

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { customers: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides.' });
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      const token = generateToken({
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone } = req.body;

      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existing) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash: hashedPassword,
          name,
          phone,
          role: 'CLIENT',
        }
      });

      const token = generateToken({
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async demoLogin(req: Request, res: Response) {
    try {
      const { role } = req.body;
      const email = role === 'ADMIN' ? 'admin@demo.local' : 'client@demo.local';

      const user = await prisma.user.findUnique({
        where: { email },
        include: { customers: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'Compte démo introuvable. Lancez `npm run seed` pour initialiser la base.' });
      }

      const token = generateToken({
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié.' });
      }

      const user = await prisma.user.findUnique({
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
