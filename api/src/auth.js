// Biblioteca para criar/assinar/verificar JSON Web Tokens (JWT)
import jwt from 'jsonwebtoken';

// Gera identificadores únicos (UUID v4) — usado como JTI (token ID) do refresh
import { v4 as uuid } from 'uuid';

// Configurações centralizadas (segredos, tempos de expiração etc.)
import { CONFIG } from './config.js';

// "Banco" em memória (Map/objeto) para guardar usuários e refresh tokens
import { db } from './store.js';

/**
 * Emite um par de tokens (access + refresh) para um usuário autenticado.
 * - Access token: curto prazo; carrega claims de autorização (sub/email/roles).
 * - Refresh token: longo prazo; inclui JTI para suportar revogação/rotação.
 * Também registra o JTI do refresh no "banco" para permitir invalidação.
 */
export function issueTokenPair(user) {
  // JTI: identificador único do refresh token (permite revogar/rotacionar)
  const jti = uuid();

  // Cria o access token com payload mínimo necessário para RBAC no backend
  const accessToken = jwt.sign(
    // Claims: sub (subject/ID do usuário), email e roles para RBAC
    { sub: user.id, email: user.email, roles: user.roles },
    // Segredo específico para access tokens
    CONFIG.accessSecret,
    // Tempo de expiração curto (ex.: 5–15 min)
    { expiresIn: CONFIG.accessExpiresIn }
  );

  // Cria o refresh token com o JTI (nunca inclua dados sensíveis no payload)
  const refreshToken = jwt.sign(
    // Apenas o essencial: sub e jti; nada de e-mail/roles aqui
    { sub: user.id, jti },
    // Segredo distinto do access (boas práticas)
    CONFIG.refreshSecret,
    // Tempo de expiração maior (ex.: dias/semanas)
    { expiresIn: CONFIG.refreshExpiresIn }
  );

  // Decodifica o refresh apenas para ler o "exp" (timestamp em segundos)
  const decoded = jwt.decode(refreshToken);

  // Registra o refresh token no armazenamento (para checagens futuras)
  // - Guardamos: jti, dono (userId), quando expira, e quando/SE foi revogado
  db.refreshTokens.set(jti, {
    jti,
    userId: user.id,
    // decoded.exp vem em segundos → convertemos para Date
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : null,
    revokedAt: null, // Ainda não revogado
  });

  // Retorna o par para o cliente (front-end)
  return { accessToken, refreshToken };
}

/**
 * Revoga um refresh token a partir do JTI.
 * - Usado em logout ou rotação (One-Time Use): invalida o token antigo.
 */
export function revokeRefreshToken(jti) {
  // Busca o registro correspondente ao JTI
  const rec = db.refreshTokens.get(jti);

  // Se existir e ainda não estiver revogado, marca como revogado agora
  if (rec && !rec.revokedAt) {
    rec.revokedAt = new Date();
    db.refreshTokens.set(jti, rec); // persiste atualização
  }
}

/**
 * Middleware de proteção de rotas (exige access token válido).
 * - Extrai "Authorization: Bearer <token>" do header.
 * - Verifica o token com o segredo de access.
 * - Anexa o payload decodificado em req.user para uso posterior.
 */
export function requireAuth(req, res, next) {
  // Lê o header Authorization (ou string vazia para evitar undefined)
  const header = req.headers.authorization || '';

  // Aceita somente o esquema "Bearer <token>"
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  // Sem token → 401 (não autenticado)
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    // Verifica assinatura e expiração do token
    const payload = jwt.verify(token, CONFIG.accessSecret);
    // Ex.: payload = { sub, email, roles, iat, exp }
    req.user = payload;

    // Autenticado → segue para a próxima middleware/rota
    next();
  } catch (e) {
    // Token inválido ou expirado → 401
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware de autorização baseada em papéis (RBAC).
 * - Garante que o usuário autenticado tenha um papel específico.
 * - Usado após requireAuth: confia em req.user.roles.
 */
export function requireRole(role) {
  // Retorna uma função middleware para uso em rotas específicas
  return (req, res, next) => {
    // Lê os papéis do usuário do payload do access token
    const roles = req.user?.roles || [];

    // Se possuir o papel exigido → segue
    if (roles.includes(role)) return next();

    // Caso contrário → 403 (proibido)
    return res.status(403).json({ error: 'Forbidden: missing role ' + role });
  };
}

/**
 * Endpoint/handler para refresh de sessão (troca de tokens).
 * - Recebe um refreshToken (body).
 * - Valida assinatura/expiração com refreshSecret.
 * - Checa no "banco" se o JTI está válido e não revogado.
 * - Rotaciona: revoga o refresh atual e emite um novo par (access + refresh).
 * - Retorna também dados mínimos do usuário (id/email/roles) para o cliente.
 */
export function handleRefresh(req, res) {
  // Extrai o refreshToken do corpo da requisição (JSON)
  const { refreshToken } = req.body || {};

  // Sem refreshToken → 400 (requisição malformada)
  if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });

  try {
    // Verifica a assinatura/expiração com o segredo de refresh
    // Payload típico: { sub, jti, iat, exp }
    const payload = jwt.verify(refreshToken, CONFIG.refreshSecret);

    // Busca o registro do JTI para validar existência e status
    const reg = db.refreshTokens.get(payload.jti);

    // Se não houver registro ou já estiver revogado → 401
    // (mitiga replay: um refresh reutilizado pós-rotação será negado)
    if (!reg || reg.revokedAt) {
      return res.status(401).json({ error: 'Refresh token revoked or unknown' });
    }

    // Rotação obrigatória: invalida o refresh atual (one-time use)
    revokeRefreshToken(payload.jti);

    // Garante que o usuário ainda existe/está ativo
    const user = db.users.get(payload.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // Emite um NOVO par (access + refresh) e retorna ao cliente
    const pair = issueTokenPair(user);
    return res.json({
      user: { id: user.id, email: user.email, roles: user.roles },
      ...pair,
    });
  } catch (e) {
    // Assinatura inválida/expirado → 401
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}
