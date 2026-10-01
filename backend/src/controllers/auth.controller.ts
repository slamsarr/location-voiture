import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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

      // Pour la démonstration, vérification simple
      const isValid = (email === 'admin@demo.local' && password === 'Admin123!') ||
                      (email === 'client@demo.local' && password === 'Client123!') ||
                      user.passwordHash === password;

      if (!isValid) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      // Session / token simulé
      const token = `token_demo_${user.role.toLowerCase()}_${user.id}`;

      return res.json({
        token,
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

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash: password,
          name,
          phone,
          role: 'CLIENT',
        }
      });

      const token = `token_demo_client_${user.id}`;
      return res.status(201).json({
        token,
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
      const { role } = req.body; // 'ADMIN' | 'CLIENT'
      const email = role === 'ADMIN' ? 'admin@demo.local' : 'client@demo.local';

      const user = await prisma.user.findUnique({
        where: { email },
        include: { customers: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'Compte démo introuvable.' });
      }

      const token = `token_demo_${user.role.toLowerCase()}_${user.id}`;
      return res.json({
        token,
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
}
