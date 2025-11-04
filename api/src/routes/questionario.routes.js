// api/src/routes/questionario.routes.js

import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const questionarioRouter = Router();

// Protege a rota, exigindo que o usuário esteja autenticado
questionarioRouter.use(requireAuth);

/**
 * [POST] /questionario - Cria ou atualiza o questionário do usuário
 */
questionarioRouter.post('/', async (req, res) => {
  const userId = req.user.sub; // ID do usuário extraído do token JWT
  const questionarioData = req.body;

  try {
    const questionario = await prisma.questionario.upsert({
      where: { userId: userId },
      update: questionarioData,
      create: {
        ...questionarioData,
        userId: userId,
      },
    });
    res.status(201).json(questionario);
  } catch (error) {
    console.error('Erro ao salvar questionário:', error);
    res.status(500).json({ error: 'Não foi possível salvar os dados do questionário.' });
  }
});