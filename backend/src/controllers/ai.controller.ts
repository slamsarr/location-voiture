import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

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
      return res.status(500).json({ error: error.message });
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
      return res.status(500).json({ error: error.message });
    }
  }
}
