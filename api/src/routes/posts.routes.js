// src/routes/posts.routes.js

import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireAuth, requireRole } from '../auth.js';
import { db } from '../store.js';

export const postsRouter = Router();

// Protege todas as rotas deste arquivo com autenticação
postsRouter.use(requireAuth);

/**
 * [GET] /posts - Listar todos os posts
 * Acessível por qualquer usuário autenticado.
 */
postsRouter.get('/', (req, res) => {
  const posts = [...db.posts.values()];
  res.json(posts);
});

/**
 * [GET] /posts/:id - Obter um post específico
 * Acessível por qualquer usuário autenticado.
 */
postsRouter.get('/:id', (req, res) => {
  const post = db.posts.get(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

/**
 * [POST] /posts - Criar um novo post
 * O post será associado ao usuário que fez a requisição.
 */
postsRouter.post('/', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newPost = {
    id: uuid(), // Gera um ID único
    title,
    content,
    ownerId: req.user.sub, // 'sub' é o ID do usuário vindo do token JWT
  };

  db.posts.set(newPost.id, newPost);

  res.status(201).json(newPost);
});

/**
 * [PUT] /posts/:id - Atualizar um post
 * Apenas o dono do post pode atualizá-lo.
 */
postsRouter.put('/:id', (req, res) => {
  const post = db.posts.get(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Boa prática: Apenas o dono pode editar
  if (post.ownerId !== req.user.sub) {
    return res.status(403).json({ error: 'Forbidden: You do not own this post' });
  }

  const { title, content } = req.body;
  const updatedPost = {
    ...post,
    title: title || post.title,
    content: content || post.content,
  };

  db.posts.set(req.params.id, updatedPost);

  res.json(updatedPost);
});

/**
 * [DELETE] /posts/:id - Deletar um post
 * Apenas o dono do post ou um administrador pode deletar.
 */
postsRouter.delete('/:id', (req, res) => {
  const post = db.posts.get(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const isOwner = post.ownerId === req.user.sub;
  const isAdmin = req.user.roles.includes('admin');

  // Boa prática: Dono ou Admin podem deletar
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden: You cannot delete this post' });
  }

  db.posts.delete(req.params.id);

  res.status(204).send(); // 204 No Content - sucesso sem corpo de resposta
});