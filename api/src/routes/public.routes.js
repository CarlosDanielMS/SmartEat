// Importa o Router do Express
import { Router } from 'express';

// Cria um roteador específico para rotas públicas (sem autenticação)
export const publicRouter = Router();

/**
 * Rota simples de teste/health check
 * - GET /public/ping
 * - Não requer autenticação
 * - Retorna apenas uma mensagem "pong (public)"
 */
publicRouter.get('/ping', (req, res) => {
  res.json({ message: 'pong (public)' });
});
