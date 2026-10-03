import { Request, Response } from 'express';
import { ContractService } from '../services/contract.service';

const isProduction = process.env.NODE_ENV === 'production';

function serverError(res: Response, error: any) {
  console.error('[ContractController]', error);
  return res.status(500).json({
    error: isProduction ? 'Une erreur interne est survenue.' : error.message,
  });
}

export class ContractController {
  public static async getContractDetails(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;
      const data = await ContractService.getContractDetails(reservationId);
      return res.json(data);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
