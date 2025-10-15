import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API } from "../api/client";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../auth/tokens";

// Definição de tipos de roles possíveis
type Role = "user" | "admin";

// Estrutura de um usuário autenticado
export interface User {
  id: string;
  email: string;
  roles: Role[];
}

// Status de autenticação
type Status = "loading" | "signedOut" | "signedIn";

// Contrato do contexto de autenticação
interface AuthContextValue {
  status: Status; // Estado global da sessão
  user: User | null; // Dados do usuário logado
  login: (email: string, password: string) => Promise<void>; // Faz login
  logout: () => Promise<void>; // Faz logout
  hasRole: (role: Role) => boolean; // Verifica se usuário tem determinado papel
}

// Cria o contexto, inicialmente indefinido
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provider do AuthContext
 * - Envolve a aplicação e gerencia estado global de autenticação
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<Status>("loading"); // estado inicial = carregando
  const [user, setUser] = useState<User | null>(null); // usuário logado (ou null)

  /**
   * Efeito inicial de bootstrap
   * - Ao montar, tenta autenticar automaticamente:
   *   1. Checa se há access token → tenta /private/me
   *   2. Se falhar, tenta refresh com refresh token
   *   3. Se ainda falhar → limpa tokens e marca como signedOut
   */
  useEffect(() => {
    (async () => {
      const access = await getAccessToken();
      if (!access) {
        setStatus("signedOut");
        return;
      }
      try {
        // Tenta validar access token direto
        const { data } = await API.get("/private/me");
        setUser(data);
        setStatus("signedIn");
      } catch {
        // Se access falhar, tenta refresh
        try {
          const rt = await getRefreshToken();
          if (!rt) throw new Error("no rt");
          const { data } = await API.post("/auth/refresh", {
            refreshToken: rt,
          });

          // Salva novos tokens
          await setTokens(data.accessToken, data.refreshToken);

          // Busca novamente dados do usuário
          const me = await API.get("/private/me");
          setUser(me.data);
          setStatus("signedIn");
        } catch {
          // Se também falhar → limpa sessão
          await clearTokens();
          setStatus("signedOut");
        }
      }
    })();
  }, []);

  /**
   * Login com email e senha
   * - Chama backend (/auth/login)
   * - Salva tokens
   * - Atualiza header Authorization
   * - Atualiza estado global com usuário logado
   */
  const login = async (email: string, password: string) => {
    const { data } = await API.post("/auth/login", { email, password });
    await setTokens(data.accessToken, data.refreshToken);
    API.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    setUser(data.user);
    setStatus("signedIn");
  };

  /**
   * Logout
   * - Chama backend (/auth/logout) para revogar refresh token
   * - Limpa tokens do storage
   * - Reseta estado global
   */
  const logout = async () => {
    try {
      const rt = await getRefreshToken();
      if (rt) await API.post("/auth/logout", { refreshToken: rt });
    } catch {}
    await clearTokens();
    setUser(null);
    setStatus("signedOut");
  };

  /**
   * Verifica se usuário possui determinado papel (role)
   * - Ex.: hasRole('admin')
   */
  const hasRole = (role: Role) => !!user?.roles?.includes(role);

  // Memoiza o valor do contexto para evitar re-renderizações desnecessárias
  const value = useMemo(
    () => ({ status, user, login, logout, hasRole }),
    [status, user]
  );

  // Provedor do contexto
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook customizado para consumir o contexto
 * - Facilita uso: const { user, login } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
