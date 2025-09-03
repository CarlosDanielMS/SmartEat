// Importa Router do Express
import { Router } from 'express';

// Middlewares de autenticação e autorização (RBAC)
import { requireAuth, requireRole } from '../auth.js';

// "Banco" em memória para usuários e tokens
import { db } from '../store.js';

// Cria um roteador para rotas seguras/protegidas
export const secureRouter = Router();

/**
 * Rota privada acessível a qualquer usuário autenticado
 * - GET /private/me
 * - Middleware requireAuth garante que o access token é válido
 * - Retorna informações básicas do usuário autenticado
 */
secureRouter.get('/me', requireAuth, (req, res) => {
  // Busca o usuário no "db" usando o sub (id) do token
  const user = db.users.get(req.user.sub);

  // Retorna dados do usuário + data de expiração do access token
  res.json({
    id: user.id,
    email: user.email,
    roles: user.roles,
    tokenExp: req.user.exp, // timestamp UNIX de expiração do access token
  });
});

/**
 * Rota privada restrita a administradores
 * - GET /private/admin/metrics
 * - requireAuth → exige token válido
 * - requireRole('admin') → exige papel 'admin'
 * - Retorna métricas básicas da API (usuários e tokens emitidos)
 */
secureRouter.get('/admin/metrics', requireAuth, requireRole('admin'), (req, res) => {
  res.json({
    usersCount: db.users.size,            // total de usuários cadastrados
    refreshTokensIssued: db.refreshTokens.size, // total de refresh tokens emitidos
    time: new Date().toISOString(),       // timestamp atual (ISO 8601)
  });
});
