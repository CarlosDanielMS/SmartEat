// api/src/routes/user.routes.js
import { Router } from 'express';
import { db } from '../store.js'; // Usando o 'banco de dados' em memória por enquanto
import { requireAuth } from '../auth.js';

export const userRouter = Router();

// Middleware para proteger todas as rotas deste arquivo
userRouter.use(requireAuth);

/**
 * [POST] /user/questionario
 * Salva ou atualiza os dados do questionário para o usuário autenticado.
 */
userRouter.post('/questionario', async (req, res) => {
  // O ID do usuário vem do token JWT (propriedade 'sub')
  const userId = req.user.sub;
  const questionarioData = req.body;

  // Validação simples dos dados recebidos
  if (!questionarioData || Object.keys(questionarioData).length === 0) {
    return res.status(400).json({ error: 'Questionnaire data is required' });
  }

  try {
    // Simulação de "upsert": cria ou atualiza o questionário para o usuário
    // Em um banco real, você usaria:
    // await prisma.questionario.upsert({ where: { userId }, create: { ...data, userId }, update: data })

    // Para o 'db' em memória, vamos simplesmente armazenar os dados.
    // A chave pode ser o próprio userId para garantir um por usuário.
    db.questionarios = db.questionarios || new Map(); // Garante que o Map exista
    db.questionarios.set(userId, { userId, ...questionarioData });

    console.log(`Questionário salvo para o usuário ${userId}:`, db.questionarios.get(userId));

    // Retorna os dados salvos
    return res.status(201).json(db.questionarios.get(userId));
  } catch (error) {
    console.error('Erro ao salvar questionário:', error);
    return res.status(500).json({ error: 'Failed to save questionnaire' });
  }
});

/**
 * [GET] /user/questionario
 * Obtém os dados do questionário do usuário autenticado.
 */
userRouter.get('/questionario', async (req, res) => {
    const userId = req.user.sub;

    try {
        const questionario = db.questionarios?.get(userId);

        if (!questionario) {
            return res.status(404).json({ error: 'Questionnaire not found for this user' });
        }

        return res.json(questionario);
    } catch (error) {
        console.error('Erro ao buscar questionário:', error);
        return res.status(500).json({ error: 'Failed to retrieve questionnaire' });
    }
});