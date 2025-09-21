// src/store.js
import bcrypt from 'bcrypt';

// Estrutura de dados em memória simulando um "banco de dados"
export const db = {
  // Armazena usuários cadastrados
  users: new Map(),

  // Armazena refresh tokens emitidos
  refreshTokens: new Map(),

  // ✅ GARANTA QUE ESTA LINHA EXISTA ✅
  posts: new Map(), // Armazena posts (id, title, content, ownerId)
};

// 🔹 SEED (pré-população do "banco" com usuários de exemplo)
(async () => {
  /**
   * Função auxiliar para criar usuário
   */
  const mkUser = async (id, email, password, roles = ['user']) => {
    const passwordHash = await bcrypt.hash(password, 10);
    db.users.set(id, { id, email, passwordHash, roles });
  };

  // Cria usuário administrador com roles ['admin', 'user']
  await mkUser('u1', 'admin@example.com', 'admin123', ['admin', 'user']);

  // Cria usuário comum apenas com role ['user']
  await mkUser('u2', 'user@example.com', 'user123', ['user']);

  // Popula com posts de exemplo
  db.posts.set('p1', { id: 'p1', title: 'Post do Admin', content: 'Este é o conteúdo.', ownerId: 'u1' });
  db.posts.set('p2', { id: 'p2', title: 'Post do Usuário', content: 'Conteúdo do post.', ownerId: 'u2' });
})();