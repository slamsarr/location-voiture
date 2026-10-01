"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("../services/ai.service");
class AIController {
    static async handleClientQuery(req, res) {
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ error: 'La requête query est obligatoire.' });
            }
            const result = await ai_service_1.AIService.handleClientQuery(query);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async handleAdminQuery(req, res) {
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ error: 'La requête query est obligatoire.' });
            }
            const result = await ai_service_1.AIService.handleAdminQuery(query);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.AIController = AIController;
