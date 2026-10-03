import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

const isProduction = process.env.NODE_ENV === 'production';

function serverError(res: Response, error: any) {
  console.error('[AIController]', error);
  return res.status(500).json({
    error: isProduction ? 'Une erreur interne est survenue.' : error.message,
  });
}

export class AIController {
  public static async handleClientQuery(req: Request, res: Response) {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'La requête query est obligatoire.' });
      }

      const result = await AIService.handleClientQuery(query);
      return res.json(result);
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public static async handleAdminQuery(req: Request, res: Response) {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'La requête query est obligatoire.' });
      }

      const result = await AIService.handleAdminQuery(query);
      return res.json(result);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
