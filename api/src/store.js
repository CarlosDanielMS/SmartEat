// Biblioteca para criptografia de senhas
// bcrypt é usado para armazenar senhas de forma segura, evitando texto puro.
// O hash é irreversível: mesmo que o banco seja comprometido, as senhas reais não são expostas.
import bcrypt from 'bcrypt';

// Estrutura de dados em memória simulando um "banco de dados"
export const db = {
  // Armazena usuários cadastrados
  // Chave = userId
  // Valor = objeto com dados do usuário (id, email, hash da senha, roles/papéis)
  users: new Map(),

  // Armazena refresh tokens emitidos
  // Chave = jti (JWT ID do refresh token)
  // Valor = objeto com dados do token (quem é o dono, expiração e revogação)
  refreshTokens: new Map(),
};

// 🔹 SEED (pré-população do "banco" com usuários de exemplo)
// É executado imediatamente ao importar este arquivo.
(async () => {
  /**
   * Função auxiliar para criar usuário
   * - Recebe: id, email, senha em texto puro, lista de roles (padrão = ["user"])
   * - Gera um hash seguro da senha com bcrypt
   * - Salva no "db.users" com os dados necessários
   */
  const mkUser = async (id, email, password, roles = ['user']) => {
    // Gera o hash da senha usando bcrypt
    // O "10" é o número de rounds de salt (quanto maior, mais seguro, mas mais lento)
    const passwordHash = await bcrypt.hash(password, 10);

    // Salva usuário no Map (em memória)
    db.users.set(id, { id, email, passwordHash, roles });
  };

  // Cria usuário administrador com roles ['admin', 'user']
  await mkUser('u1', 'admin@example.com', 'admin123', ['admin', 'user']);

  // Cria usuário comum apenas com role ['user']
  await mkUser('u2', 'user@example.com', 'user123', ['user']);
})();
