"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractController = void 0;
const contract_service_1 = require("../services/contract.service");
const isProduction = process.env.NODE_ENV === 'production';
function serverError(res, error) {
    console.error('[ContractController]', error);
    return res.status(500).json({
        error: isProduction ? 'Une erreur interne est survenue.' : error.message,
    });
}
class ContractController {
    static async getContractDetails(req, res) {
        try {
            const { reservationId } = req.params;
            const data = await contract_service_1.ContractService.getContractDetails(reservationId);
            return res.json(data);
        }
        catch (error) {
            return serverError(res, error);
        }
    }
}
exports.ContractController = ContractController;
