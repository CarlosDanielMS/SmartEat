# React Native

## Criando um projeto com React Native no Expo

Para criar um projeto do zero em React Native com TypeScript usando Expo, o processo é bastante simplificado, já que o Expo cuida de muita da configuração automaticamente. Aqui está um passo a passo:

1. Instalar o Expo CLI
   O Expo CLI é uma ferramenta de linha de comando que facilita a criação e execução de projetos React Native. Primeiro, você precisará instalar o expo-cli globalmente.

```bash
npm install -g expo-cli
```

2. Criar um Projeto com Expo e TypeScript
   Depois de instalar o Expo CLI, você pode criar um novo projeto. O Expo possui um template pronto para TypeScript.

```bash
expo init MeuProjeto
```

Após rodar esse comando, o Expo perguntará qual template deseja usar. Selecione a opção "blank (TypeScript)":

```bash
? Choose a template: (Use arrow keys)
  ----- Managed workflow -----
  blank
> blank (TypeScript)  <- Escolha esta opção
  blank (JavaScript)
  tabs (TypeScript)
```

O Expo irá gerar o projeto com toda a configuração necessária para usar TypeScript.

3. Navegar para o Diretório do Projeto
   Assim que o projeto for criado, entre no diretório do projeto recém-gerado:

```bash
cd MeuProjeto
```

4. Rodar o Projeto
   Agora, você pode iniciar o servidor de desenvolvimento Expo, que permitirá testar o app em um dispositivo físico, emulador ou no navegador.

```bash
expo start ou npx expo start
```

Este comando abrirá o Expo Developer Tools no seu navegador. A partir daí, você pode:

Usar o Expo Go App no seu dispositivo móvel (iOS/Android) para visualizar o projeto escaneando o QR Code.
Rodar em um emulador Android ou iOS, se estiver com o ambiente configurado.

Caso necessário, pode rodar **npm uninstall -g expo-cli**

---

## Autenticação e Autorização em React Native

Autenticação e autorização em **React Native** são dois pilares essenciais para qualquer aplicação que lida com dados de usuários, integrações externas ou funcionalidades restritas. Vamos separar os conceitos e contextualizar no ambiente de desenvolvimento mobile.

---

### 🔑 Autenticação

A autenticação é o processo de **verificar a identidade do usuário**.  
Em outras palavras, é quando o app precisa garantir que o usuário é quem ele diz ser.

No contexto de React Native, isso pode envolver diferentes estratégias:

- **Login com credenciais (usuário/senha):** método mais comum, geralmente apoiado por APIs REST ou GraphQL.
- **Tokens de autenticação (JWT, OAuth2):** após validar as credenciais, o servidor emite um token, que será usado nas requisições subsequentes.
- **Integrações sociais:** login via Google, Facebook, Apple ou outros provedores, usando protocolos como OAuth.
- **Biometria e métodos locais:** FaceID, TouchID ou PIN, muitas vezes combinados com autenticação remota.

O objetivo aqui é garantir que apenas usuários válidos consigam acessar o app ou iniciar uma sessão segura.

---

### 🛡️ Autorização

A autorização é o processo de **definir o que o usuário autenticado pode ou não fazer** dentro da aplicação.  
Ou seja, depois que o sistema sabe quem é o usuário, precisa verificar quais permissões ele tem:

- **Baseada em papéis (RBAC – Role-Based Access Control):** usuários pertencem a papéis (admin, editor, leitor) que definem acessos.
- **Baseada em atributos (ABAC – Attribute-Based Access Control):** permissões derivam de condições mais detalhadas, como departamento, localização, status da conta etc.
- **Baseada em escopos (OAuth2):** comum em APIs, define granularmente os recursos que um token pode acessar.

O foco é garantir que mesmo usuários autenticados não ultrapassem os limites de acesso definidos.

---

### 🔒 Boas práticas em React Native

- **Armazenamento seguro de tokens:** usar soluções como SecureStore, Keychain (iOS) e Keystore (Android), evitando AsyncStorage para dados sensíveis.
- **Fluxo de renovação de tokens:** refresh tokens ajudam a manter sessões ativas sem exigir login constante.
- **Proteção de rotas:** implementar lógica de navegação que só permite acessar determinadas telas se o usuário estiver autenticado e autorizado.
- **Integração com backend:** a verificação final de permissões deve ser feita no servidor, o app atua como camada de controle inicial.

---

**Resumindo:**

- **Autenticação** garante _quem é o usuário_.
- **Autorização** garante _o que ele pode fazer_.

No React Native, ambos devem ser planejados em conjunto com a API/backend, respeitando práticas de segurança e uma boa experiência de uso.

## 🔁 Conceitos de Refresh Token

### O que é

- **Access token:** credencial de curta duração (ex.: 5–15 min) usada para autorizar chamadas à API.
- **Refresh token:** credencial de longa duração (ex.: dias/semanas) usada apenas para obter um novo par `{access, refresh}` quando o access expira — não deve autorizar recursos de negócio.

### Por que existe

- Minimiza a janela de ataque: mesmo se um access token vazar, ele expira rápido.
- Evita logins frequentes: mantém a sessão do usuário por mais tempo, de forma segura.

### Como funciona (ciclo padrão)

1. Usuário faz login → servidor emite `{accessToken curto, refreshToken longo}`.
2. Cliente usa apenas o access token nas requisições.
3. Ao expirar (ou pouco antes), o cliente chama `/auth/refresh` com o refresh token.
4. Servidor valida o refresh token e emite novo par `{novoAccess, novoRefresh}`.
5. **Rotação:** o refresh token antigo é revogado (one-time use). Se alguém tentar reutilizá-lo, detecta-se **replay**.

### Boas práticas essenciais

- **Rotação de refresh token (one-time use):** toda renovação deve:
  - invalidar o refresh anterior,
  - registrar o novo (com jti, expiração, device) e
  - retornar o novo par ao cliente.
- **Lista de revogação/estado no servidor:** guardar o jti (ID do refresh) com status (válido, revogado, expirado) para:
  - logout, troca de senha, mudança de papéis,
  - detectar reuso (se o token antigo reaparecer, sinal de comprometimento → derrubar a sessão/dispositivo).
- **Vidas diferentes:**
  - access: curto (minutos).
  - refresh: mais longo (dias/semanas) com limites (ex.: 30 dias desde o primeiro uso).
- **Escopo mínimo:** refresh não deve acessar dados do usuário; apenas renovar credenciais.
- **Binding ao dispositivo (opcional, recomendado):** guardar deviceId, IP, user-agent ou fingerprint do app. Em caso de variação suspeita, exigir reautenticação/MFA.
- **PKCE/OIDC (quando SSO):** preferir o padrão de mercado para reduzir riscos em fluxos móveis.
- **Armazenamento seguro:** no mobile, Keychain/Keystore para refresh; evite AsyncStorage em produção para segredos.
- **TLS obrigatório + CORS restrito + rate limiting** em `/auth/refresh`.
- **Grace period (opcional):** janela curta para aceitar o refresh antigo e o novo, mitigando condições de corrida entre múltiplas abas/dispositivos.

### Padrões de sessão

- **Sliding session:** cada refresh “estende” a validade, até um máximo (ex.: 30 dias desde o login).
- **Idle timeout:** expirar refresh se ficar sem uso por X dias (inatividade).
- **Absolute timeout:** expirar refresh após Y dias, independentemente de uso.

### Erros e respostas esperadas

- Refresh inválido/expirado/revogado → `401 Unauthorized` e o cliente deve destruir a sessão local e enviar o usuário ao login.
- Reuso detectado (token antigo após rotação) → `401` + sinalização interna de possível compromisso (opcionalmente invalidar toda a família de tokens daquele device/usuário).

---

## 🧭 Rotas e Fluxo do Backend

### A API de exemplo exposta

**Públicas**

- `GET /public/ping` — teste simples (sem auth).

**Autenticação**

- `POST /auth/register` — (demo) cria usuário.
- `POST /auth/login` — valida credenciais e emite par `{access, refresh}`.
- `POST /auth/refresh` — rotaciona o refresh token e retorna novo par.
- `POST /auth/logout` — revoga o refresh atual.

**Protegidas**

- `GET /private/me` — requer access token válido.
- `GET /private/admin/metrics` — requer access token válido com papel admin.

### Middlewares centrais

- **requireAuth:**

  - Lê `Authorization: Bearer <access>`.
  - Verifica assinatura e expiração do access token.
  - Popula `req.user` com claims (ex.: sub, email, roles).
  - Caso falhe → `401 Unauthorized`.

- **requireRole('admin'):**
  - Lê `req.user.roles`.
  - Se não incluir `admin` → `403 Forbidden`.

### Emissão e verificação de tokens

- **Access token (JWT assinado):**

  - Payload: `sub`, `email`, `roles`.
  - Expira em `JWT_ACCESS_EXPIRES` (ex.: 15m).
  - Usado exclusivamente para acessar rotas de negócio.

- **Refresh token (JWT assinado):**
  - Payload: `sub`, `jti` (ID único).
  - Expira em `JWT_REFRESH_EXPIRES` (ex.: 7d).
  - Persistido no servidor por `jti` para permitir revogação/rotação.

### Fluxos detalhados

1. **Login**

- **Entrada:** `{ email, password }`
- **Processo:**
  - Localiza usuário e compara senha (hash bcrypt).
  - Gera `jti` (UUID), emite:
    - `accessToken` (curto),
    - `refreshToken` (longo, contendo jti).
  - Salva registro do refresh (`jti, userId, expiresAt, revokedAt=null`).
  - Responde com `{ user, accessToken, refreshToken }`.
- **Erros:** credenciais inválidas → `401`.

2. **Acesso à rota privada** (`/private/me`)

- **Entrada:** `Authorization: Bearer <access>`
- **Processo:**
  - `requireAuth` valida assinatura/exp.
  - Se ok, busca dados do usuário e retorna perfil básico.
- **Erros:** token ausente/ inválido/ expirado → `401`.

3. **Acesso com papel** (`/private/admin/metrics`)

- **Entrada:** `Authorization: Bearer <access>`
- **Processo:**
  - `requireAuth` valida o access.
  - `requireRole('admin')` checa roles.
  - Retorna métricas.
- **Erros:** sem auth → `401`; sem papel → `403`.

4. **Refresh** (`/auth/refresh`)

- **Entrada:** `{ refreshToken }`
- **Processo:**
  - Verifica assinatura/exp do refresh com a chave de refresh.
  - Extrai `jti` e verifica na store se:
    - existe,
    - não está revogado,
    - não está expirado (pelo `exp`).
  - **Rotação:**
    - marca o `jti` anterior como revogado,
    - emite novo par `{access, refresh}` com novo jti,
    - persiste o novo jti.
  - Responde `{ user, accessToken, refreshToken }`.
- **Erros:**
  - Refresh inválido/expirado/revogado → `401`.
  - (Opcional) detectar reuso: se um `jti` já revogado reaparecer, sinalizar comprometimento e derrubar sessões do usuário/dispositivo.

5. **Logout** (`/auth/logout`)

- **Entrada:** `{ refreshToken }`
- **Processo:**
  - Extrai `jti` do refresh (sem precisar validar exp).
  - Marca esse `jti` como revogado.
  - Responde `{ ok: true }`.
- **Observação:** logout não invalida o access token que ainda pode estar vivo por alguns minutos; por isso, o cliente deve apagar o access localmente e, idealmente, o backend deve aceitar somente chamadas com access válido e não permitir novos refreshs com o `jti` revogado.

### Sequências (ASCII)

**A) Login inicial**

```
[App] --(email/senha)--> [/auth/login]
[API] --valida credenciais--> ok
[API] --emite--> access(15m), refresh(7d c/ jti)
[App] <-- tokens + perfil
```

**B) Chamada a rota privada**

```
[App] -- Authorization: Bearer access --> [/private/me]
[API] -- verifica access --> ok
[API] <-- dados do usuário
```

**C) Renovação com rotação**

```
[App] -- {refresh} --> [/auth/refresh]
[API] -- verifica refresh + jti --> ok
[API] -- revoga jti antigo; emite novo par --> {access2, refresh2(jti2)}
[App] <-- tokens novos
```

**D) Logout**

```
[App] -- {refresh atual} --> [/auth/logout]
[API] -- revoga jti
[App] -- apaga tokens locais
```

### Estados e falhas para prever no cliente

- `401` na rota privada:
  - Tentar refresh uma única vez (single-flight: evitar múltiplos refresh paralelos).
  - Se refresh falhar → limpar sessão e redirecionar para login.
- **Rede instável:**
  - Retry/backoff; se o access expirar no meio da fila, fazer refresh e replay da requisição.
- **Troca de senha/banimento:**
  - Revogar refresh tokens do usuário; a próxima tentativa de refresh cai em `401` → forçar reautenticação.

### Notas de produção (além do demo)

- Persistir refresh tokens em banco/Redis (não em memória).
- Assinatura assimétrica (RS256) em vez de HS256 quando múltiplos serviços validam tokens.
- TLS pinning no mobile (alto risco).
- MFA e políticas adaptativas (geo/IP, horário, device).
- Auditoria: logar login/refresh/logout, erros 401/403, reusos detectados.
- Limitar escopo e payload do JWT (evitar PII no token).

---

# 📦 AsyncStorage no React Native

## O que é

**AsyncStorage** é uma API de armazenamento persistente e assíncrona disponível no React Native.  
Ela permite salvar **pares de chave-valor** no dispositivo do usuário, funcionando de forma semelhante a um “localStorage” do navegador, mas com suporte a operações assíncronas.

É bastante usada para guardar pequenas informações que precisam ser mantidas entre sessões, como preferências, estado de login ou cache simples.

---

## Principais características

- **Assíncrono:** todas as operações retornam _Promises_, evitando travar a UI.
- **Persistente:** os dados ficam disponíveis mesmo após o usuário fechar o app.
- **Baseado em chave-valor:** funciona como um dicionário simples (`{ chave: valor }`).
- **Cross-platform:** compatível tanto com iOS quanto com Android.
- **Armazenamento simples:** voltado para pequenas quantidades de dados (não substitui bancos locais como SQLite ou Realm).

---

## Como funciona

1. **Salvar dados:**  
   Você fornece uma chave (`string`) e um valor (`string`). O valor precisa ser serializado (ex.: JSON) se não for texto simples.

   ```ts
   await AsyncStorage.setItem("user", JSON.stringify({ id: 1, name: "Alice" }));
   ```

2. **Ler dados:**  
   Recupera o valor associado à chave. Se não existir, retorna `null`.

   ```ts
   const user = await AsyncStorage.getItem("user");
   if (user) console.log(JSON.parse(user));
   ```

3. **Remover dados:**  
   Apaga a entrada associada à chave.

   ```ts
   await AsyncStorage.removeItem("user");
   ```

4. **Operações múltiplas:**  
   Permite manipular várias chaves de uma vez (`multiGet`, `multiSet`, `multiRemove`).

---

## Limitações

- **Segurança:** os dados não são criptografados por padrão. Não é adequado para informações sensíveis como senhas ou refresh tokens em produção (use **Keychain** no iOS e **Keystore** no Android).
- **Tamanho:** indicado para pequenos volumes de dados, não para grandes coleções ou dados binários.
- **Performance:** leituras e escritas muito grandes podem impactar a performance.

---

## Casos de uso comuns

- Guardar **token de sessão** (apenas para demonstração ou ambientes de baixo risco).
- Salvar **preferências do usuário** (tema, idioma, etc.).
- **Flags de onboarding** (ex.: “já viu a introdução?”).
- Cache leve de informações que podem ser revalidadas com o backend.

---

## Alternativas para cenários mais complexos

- **SecureStore (Expo), react-native-keychain ou EncryptedStorage:** quando for necessário armazenamento seguro de credenciais.
- **SQLite / Realm / WatermelonDB:** quando o app precisa de persistência estruturada, consultas complexas ou grandes quantidades de dados.
- **MMKV (Meta):** alternativa mais rápida e eficiente para chave-valor.

---

Em resumo, o **AsyncStorage** é ideal para **dados simples e não sensíveis** que precisam persistir entre sessões. Para segurança ou escalabilidade, considere alternativas mais robustas.

---

# React Native Auth Demo (Expo + TS + Stack Navigation)

App Expo alinhado ao backend Express (JWT, refresh com rotação e RBAC). Inclui:

- Login/Logout
- Armazenamento de tokens com AsyncStorage (didático)
- Axios com interceptor de **refresh automático** e fila (single‑flight)
- **Stack Navigation** com **rotas públicas**, **privadas** e **guard por papel (admin)**

> ⚠️ Produção: prefira Keychain/Keystore para guardar refresh token.

---

## 🧰 Criar o projeto do zero

```bash
# 1) Criar app Expo com TypeScript
npx create-expo-app rn-auth-demo -t expo-template-blank-typescript
cd rn-auth-demo

# 2) Instalar navegação + deps nativas
npm i @react-navigation/native @react-navigation/native-stack
expo install react-native-screens react-native-safe-area-context

# 3) AsyncStorage e Axios
expo install @react-native-async-storage/async-storage
npm i axios

# (Opcional) Tipos
npm i -D @types/react @types/react-native

# 4) Rodar
npm run start
# Emulador Android: "a" | iOS: "i"
```

---

## 📁 Estrutura sugerida

```
.
├── App.tsx
├── babel.config.js
├── tsconfig.json
└── src/
    ├── api/
    │   └── client.ts
    ├── auth/
    │   └── tokens.ts
    ├── context/
    │   └── AuthContext.tsx
    ├── navigation/
    │   └── AppNavigator.tsx
    ├── components/
    │   └── AdminOnly.tsx
    └── screens/
        ├── SplashScreen.tsx
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        └── AdminScreen.tsx
```

---

## `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
```

## `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "target": "esnext",
    "module": "esnext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": ["react", "react-native"]
  }
}
```

---

## `src/auth/tokens.ts` (AsyncStorage + helpers)

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export async function setTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, accessToken],
    [REFRESH_KEY, refreshToken],
  ]);
}

export async function getAccessToken() {
  const v = await AsyncStorage.getItem(ACCESS_KEY);
  return v || "";
}

export async function getRefreshToken() {
  const v = await AsyncStorage.getItem(REFRESH_KEY);
  return v || "";
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}
```

---

## `src/api/client.ts` (Axios + refresh automático com fila)

```ts
import axios, { AxiosError, AxiosInstance } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../auth/tokens";

// Emulador Android usa 10.0.2.2; iOS simulador pode usar localhost
const BASE_URL = "http://10.0.2.2:4000";

export const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Header inicial
(async () => {
  const access = await getAccessToken();
  if (access) API.defaults.headers.common.Authorization = `Bearer ${access}`;
})();

let refreshing = false;
let waiters: { resolve: (t: string) => void; reject: (e: unknown) => void }[] =
  [];

function enqueueWaiter() {
  return new Promise<string>((resolve, reject) =>
    waiters.push({ resolve, reject })
  );
}
function resolveWaiters(token: string) {
  waiters.forEach((w) => w.resolve(token));
  waiters = [];
}
function rejectWaiters(err: unknown) {
  waiters.forEach((w) => w.reject(err));
  waiters = [];
}

API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config || {};

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (refreshing) {
        const token = await enqueueWaiter();
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${token}`,
        };
        return API(original);
      }

      try {
        refreshing = true;
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await API.post("/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data;

        await setTokens(accessToken, newRefresh);
        API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        resolveWaiters(accessToken);

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return API(original);
      } catch (e) {
        rejectWaiters(e);
        await clearTokens();
        // aqui você pode emitir um evento para a navegação ir para Login
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## `src/context/AuthContext.tsx` (estado global e bootstrap)

```tsx
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

type Role = "user" | "admin";
export interface User {
  id: string;
  email: string;
  roles: Role[];
}

type Status = "loading" | "signedOut" | "signedIn";

interface AuthContextValue {
  status: Status;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      // bootstrap: tenta /private/me se houver access token
      const access = await getAccessToken();
      if (!access) {
        setStatus("signedOut");
        return;
      }
      try {
        const { data } = await API.get("/private/me");
        setUser(data);
        setStatus("signedIn");
      } catch {
        // tenta refresh se houver
        try {
          const rt = await getRefreshToken();
          if (!rt) throw new Error("no rt");
          const { data } = await API.post("/auth/refresh", {
            refreshToken: rt,
          });
          await setTokens(data.accessToken, data.refreshToken);
          const me = await API.get("/private/me");
          setUser(me.data);
          setStatus("signedIn");
        } catch {
          await clearTokens();
          setStatus("signedOut");
        }
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await API.post("/auth/login", { email, password });
    await setTokens(data.accessToken, data.refreshToken);
    API.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    setUser(data.user);
    setStatus("signedIn");
  };

  const logout = async () => {
    try {
      const rt = await getRefreshToken();
      if (rt) await API.post("/auth/logout", { refreshToken: rt });
    } catch {}
    await clearTokens();
    setUser(null);
    setStatus("signedOut");
  };

  const hasRole = (role: Role) => !!user?.roles?.includes(role);

  const value = useMemo(
    () => ({ status, user, login, logout, hasRole }),
    [status, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

---

## `src/navigation/AppNavigator.tsx` (stacks públicas/privadas)

```tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AdminScreen from "../screens/AdminScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {status === "signedOut" ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ title: "Admin" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
```

---

## `src/components/AdminOnly.tsx` (guard de papel)

```tsx
import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";

const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasRole } = useAuth();
  if (!hasRole("admin"))
    return (
      <View style={{ padding: 16 }}>
        <Text>Acesso negado (admin apenas).</Text>
      </View>
    );
  return <>{children}</>;
};

export default AdminOnly;
```

---

## `src/screens/SplashScreen.tsx`

```tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
```

## `src/screens/LoginScreen.tsx`

```tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Entrar</Text>
      {!!error && <Text style={{ color: "red" }}>{error}</Text>}
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10 }}
      />
      <Button
        title={loading ? "..." : "Login"}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );
}
```

## `src/screens/HomeScreen.tsx`

```tsx
import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/client";

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const callMe = async () => {
    try {
      const { data } = await API.get("/private/me");
      Alert.alert("ME", JSON.stringify(data));
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.error || "Falha");
    }
  };

  const callAdmin = async () => {
    try {
      const { data } = await API.get("/private/admin/metrics");
      Alert.alert("ADMIN", JSON.stringify(data));
    } catch (e: any) {
      Alert.alert("Sem permissão", JSON.stringify(e?.response?.data || {}));
    }
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Bem-vindo, {user?.email}
      </Text>
      <Button title="/private/me" onPress={callMe} />
      <Button title="/private/admin/metrics" onPress={callAdmin} />
      <Button
        title="Ir para tela Admin"
        onPress={() => navigation.navigate("Admin")}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## `src/screens/AdminScreen.tsx`

```tsx
import React from "react";
import { View, Text } from "react-native";
import AdminOnly from "../components/AdminOnly";

export default function AdminScreen() {
  return (
    <AdminOnly>
      <View style={{ padding: 24 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          Área do Administrador
        </Text>
        <Text>Somente usuários com papel `admin` podem ver esta tela.</Text>
      </View>
    </AdminOnly>
  );
}
```

---

## `App.tsx`

```tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
```

---

## ✅ Dicas de execução

- Inicie o backend em `http://localhost:4000`.
- Dispositivo físico: use o IP da sua máquina (ex.: `http://192.168.0.10:4000`).

---
