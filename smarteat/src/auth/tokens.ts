// AsyncStorage é o armazenamento assíncrono nativo do React Native
// - Similar ao localStorage do navegador, mas persistente e assíncrono
// - Armazena pares chave/valor em disco no dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";

// Chaves fixas usadas para salvar os tokens no AsyncStorage
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

/**
 * Salva (ou atualiza) os tokens de autenticação.
 * - Usa `multiSet` para gravar os dois valores de uma vez.
 * - É chamado após login ou refresh bem-sucedido.
 */
export async function setTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, accessToken],
    [REFRESH_KEY, refreshToken],
  ]);
}

/**
 * Recupera o access token armazenado.
 * - Retorna a string salva ou string vazia se não existir.
 * - Usado para montar o header Authorization (Bearer).
 */
export async function getAccessToken() {
  const v = await AsyncStorage.getItem(ACCESS_KEY);
  return v || "";
}

/**
 * Recupera o refresh token armazenado.
 * - Retorna a string salva ou string vazia se não existir.
 * - Usado quando o access token expira e precisa de refresh.
 */
export async function getRefreshToken() {
  const v = await AsyncStorage.getItem(REFRESH_KEY);
  return v || "";
}

/**
 * Remove ambos os tokens do armazenamento.
 * - Usado no logout ou quando o refresh falha.
 */
export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}
