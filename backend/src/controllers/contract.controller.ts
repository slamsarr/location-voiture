import { Request, Response } from 'express';
import { ContractService } from '../services/contract.service';

export class ContractController {
  public static async getContractDetails(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;
      const data = await ContractService.getContractDetails(reservationId);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
