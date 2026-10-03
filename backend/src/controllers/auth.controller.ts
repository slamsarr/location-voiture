import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, verifyPassword, generateToken, AuthRequest } from '../utils/auth';

const isProduction = process.env.NODE_ENV === 'production';

function serverError(res: Response, error: any) {
  console.error('[AuthController]', error);
  return res.status(500).json({
    error: isProduction ? 'Une erreur interne est survenue.' : error.message,
  });
}

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
      return serverError(res, error);
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
      return serverError(res, error);
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
      return serverError(res, error);
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
      return serverError(res, error);
    }
  }

  public static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          customers: {
            include: {
              reservations: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: true }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
      }

      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        customer: user.customers,
      });
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié.' });
      }

      const {
        name,
        phone,
        address,
        city,
        country,
        licenseNumber,
        licenseExpiry,
        licenseCountry,
      } = req.body;

      // Mise à jour de l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: name || undefined,
          phone: phone || undefined,
        },
        include: { customers: true }
      });

      // Mise à jour ou création du profil client rattaché
      let customer = updatedUser.customers;
      const [firstName, ...lastNames] = (name || updatedUser.name).split(' ');
      const lastName = lastNames.join(' ') || firstName;

      if (customer) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            firstName: firstName || customer.firstName,
            lastName: lastName || customer.lastName,
            phone: phone || customer.phone,
            address: address !== undefined ? address : customer.address,
            city: city !== undefined ? city : customer.city,
            country: country !== undefined ? country : customer.country,
            licenseNumber: licenseNumber !== undefined ? licenseNumber : customer.licenseNumber,
            licenseExpiry: licenseExpiry !== undefined ? licenseExpiry : customer.licenseExpiry,
            licenseCountry: licenseCountry !== undefined ? licenseCountry : customer.licenseCountry,
          }
        });
      } else if (licenseNumber && licenseExpiry) {
        customer = await prisma.customer.create({
          data: {
            userId: updatedUser.id,
            firstName,
            lastName,
            email: updatedUser.email,
            phone: phone || updatedUser.phone || '',
            licenseNumber,
            licenseExpiry,
            licenseCountry: licenseCountry || 'Sénégal',
            address: address || '',
            city: city || 'Dakar',
            country: country || 'Sénégal',
          }
        });
      }

      return res.json({
        message: 'Profil mis à jour avec succès.',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          role: updatedUser.role,
          customer,
        }
      });
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public static async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié.' });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
      }

      const isValid = await verifyPassword(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
      }

      const hashedPassword = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword }
      });

      return res.json({ message: 'Votre mot de passe a été modifié avec succès.' });
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}

