// Importa o Router do Express para criar rotas de forma modular
import { Router } from 'express';

// Biblioteca para hash e verificação de senhas
import bcrypt from 'bcrypt';

// "Banco de dados" em memória (usuários e refresh tokens)
import { db } from '../store.js';

// Funções utilitárias de autenticação (tokens, refresh, revogação)
import { handleRefresh, issueTokenPair, revokeRefreshToken } from '../auth.js';

// Cria um roteador específico para autenticação
export const authRouter = Router();

/**
 * Rota de registro (signup)
 * - Apenas para demonstração: cadastra usuário em memória
 * - Requer email + senha no corpo
 */
authRouter.post('/register', async (req, res) => {
  const { email, password, roles } = req.body || {};

  // Validação: precisa de email e senha
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });

  // Verifica se já existe usuário com este email
  const exists = [...db.users.values()].find(u => u.email === email);
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  // Gera novo id (ex.: u3, u4...)
  const id = 'u' + (db.users.size + 1);

  // Gera hash seguro da senha antes de salvar
  const passwordHash = await bcrypt.hash(password, 10);

  // Salva no "banco": id, email, hash e roles (padrão = ['user'])
  db.users.set(id, { id, email, passwordHash, roles: Array.isArray(roles) ? roles : ['user'] });

  // Retorna status 201 (criado) sem expor a senha
  return res.status(201).json({ id, email });
});

/**
 * Rota de login
 * - Verifica email e senha
 * - Emite par de tokens (access + refresh) se credenciais forem válidas
 */
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  // Validação: precisa de email e senha
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });

  // Busca usuário pelo email
  const user = [...db.users.values()].find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Compara senha em texto com o hash salvo
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  // Se ok → emite tokens (access + refresh)
  const pair = issueTokenPair(user);

  // Retorna dados do usuário + tokens
  return res.json({
    user: { id: user.id, email: user.email, roles: user.roles },
    ...pair,
  });
});

/**
 * Rota de refresh
 * - Faz rotação segura do refresh token
 * - Implementação delegada para handleRefresh (em auth.js)
 */
authRouter.post('/refresh', handleRefresh);

/**
 * Rota de logout
 * - Revoga refresh token informado
 * - Opcional: mesmo expirado, podemos revogar (não há problema)
 */
authRouter.post('/logout', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });

  try {
    // Extrai payload do JWT (segunda parte, base64)
    // Aqui pegamos o JTI sem verificar expiração (logout mesmo expirado é válido)
    const { jti } = JSON.parse(
      Buffer.from(refreshToken.split('.')[1], 'base64').toString('utf8')
    );

    // Se houver JTI, revoga no banco em memória
    if (jti) revokeRefreshToken(jti);
  } catch {
    // Ignora erros silenciosamente (logout é idempotente)
  }

  // Sempre responde ok (mesmo que o token não exista ou já esteja revogado)
  return res.json({ ok: true });
});
