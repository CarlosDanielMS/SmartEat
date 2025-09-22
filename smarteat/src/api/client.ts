// Importa o Axios e os tipos auxiliares
import axios, { AxiosError, AxiosInstance } from "axios";

// Funções utilitárias para lidar com tokens no armazenamento (ex.: AsyncStorage)
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../auth/tokens";

// 🔹 Base URL da API
// - Emulador Android → usa 192.168.0.138 para acessar localhost da máquina
// - iOS Simulator → pode usar "localhost"
// - Aqui está fixo no IP local da rede
const BASE_URL = "http://192.168.0.213:4000";

// Cria instância do Axios com baseURL e timeout de 10s
export const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 🔹 Inicializa header Authorization com token armazenado (se existir)
(async () => {
  const access = await getAccessToken();
  if (access) API.defaults.headers.common.Authorization = `Bearer ${access}`;
})();

// Controle de refresh em andamento
let refreshing = false;

// Fila de "esperando refresh" → cada waiter é uma Promise pendente
let waiters: { resolve: (t: string) => void; reject: (e: unknown) => void }[] =
  [];

// Adiciona requisição à fila (quando refresh está em andamento)
function enqueueWaiter() {
  return new Promise<string>((resolve, reject) =>
    waiters.push({ resolve, reject })
  );
}

// Resolve todas as requisições pendentes com novo token
function resolveWaiters(token: string) {
  waiters.forEach((w) => w.resolve(token));
  waiters = [];
}

// Rejeita todas as requisições pendentes (falha no refresh)
function rejectWaiters(err: unknown) {
  waiters.forEach((w) => w.reject(err));
  waiters = [];
}

// 🔹 Interceptor de resposta do Axios
API.interceptors.response.use(
  // Caso sucesso → retorna normalmente
  (res) => res,

  // Caso erro → intercepta
  async (error: AxiosError) => {
    const original: any = error.config || {};

    // Se resposta foi 401 (não autorizado) e não tentamos retry ainda
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // evita loop infinito

      // Caso já esteja em refresh, aguarda na fila
      if (refreshing) {
        const token = await enqueueWaiter();
        // Reaplica novo token no header
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${token}`,
        };
        return API(original); // reexecuta a requisição original
      }

      try {
        refreshing = true; // marca que refresh está em andamento

        // Obtém refresh token armazenado
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        // Faz chamada à API de refresh
        const { data } = await API.post("/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data;

        // Atualiza tokens no armazenamento
        await setTokens(accessToken, newRefresh);

        // Atualiza header padrão com novo access token
        API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Libera fila de requisições pendentes com novo token
        resolveWaiters(accessToken);

        // Reaplica token na requisição original
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return API(original); // reexecuta a requisição original
      } catch (e) {
        // Falha → rejeita todas as pendências
        rejectWaiters(e);

        // Limpa tokens salvos
        await clearTokens();

        // Aqui poderia redirecionar para tela de Login, ex. via evento global
        return Promise.reject(e);
      } finally {
        refreshing = false; // libera o "lock" de refresh
      }
    }

    // Se não for erro 401 → propaga erro normalmente
    return Promise.reject(error);
  }
);
