// Importações de pacotes externos
import express from 'express'; // Framework para criar servidores HTTP em Node.js
import cors from 'cors'; // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import helmet from 'helmet'; // Middleware que adiciona headers de segurança
import morgan from 'morgan'; // Middleware para logs HTTP no console

// Importações internas (configurações e rotas)
import { CONFIG } from './config.js'; // Arquivo de configuração (porta, variáveis de ambiente etc.)
import { publicRouter } from './routes/public.routes.js'; // Rotas públicas (não requerem autenticação)
import { authRouter } from './routes/auth.routes.js'; // Rotas de autenticação (login, signup, refresh token etc.)
import { secureRouter } from './routes/secure.routes.js'; // Rotas privadas (protegidas, exigem autenticação)
import { questionarioRouter } from './routes/questionario.routes.js';
import { userRouter } from './routes/user.routes.js'; 

// Criação da aplicação Express
const app = express();

// 🔐 Middlewares globais
app.use(helmet()); // Ativa cabeçalhos de segurança (evita vulnerabilidades comuns como XSS, clickjacking etc.)

// Configuração do CORS
// - origin: true → permite qualquer origem (ideal para desenvolvimento)
// - credentials: true → permite envio de cookies/autenticação
// Obs.: em produção, configure `origin` para o domínio do seu app.
app.use(cors({ origin: true, credentials: true }));

// Middleware para interpretar requisições JSON
app.use(express.json());

// Middleware de log de requisições HTTP
// - 'dev' → formato simplificado e colorido (método, status, tempo de resposta)
app.use(morgan('dev'));

app.use('/questionario', questionarioRouter);


// 🚏 Registro das rotas
// Todas as rotas que começam com "/public" serão tratadas pelo publicRouter
app.use('/public', publicRouter);

// Todas as rotas que começam com "/auth" serão tratadas pelo authRouter
app.use('/auth', authRouter);

// Todas as rotas que começam com "/private" serão tratadas pelo secureRouter
app.use('/private', secureRouter);

app.use('/user', userRouter);

// Rota principal (root da API)
// Usada geralmente para health check ou status do servidor
app.get('/', (_, res) => res.json({ ok: true, ts: Date.now() }));

// 🛑 Middleware de tratamento de erros
// - Captura qualquer erro que aconteça nas rotas/middlewares
// - Retorna status 500 (erro interno do servidor)
app.use((err, _req, res, _next) => {
  console.error(err); // Loga o erro no servidor
  res.status(500).json({ error: 'Internal error' }); // Resposta genérica ao cliente
});

// 🚀 Inicialização do servidor
// O servidor escuta na porta definida no arquivo de configuração
app.listen(CONFIG.port, () => {
  console.log(`API running on http://localhost:${CONFIG.port}`);
});
