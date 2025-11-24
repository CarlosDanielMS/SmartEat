// apps/mobile/src/lib/supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do painel do Supabase
const supabaseUrl = 'https://lihpyhdgvbokechqvgvr.supabase.co';
const supabaseAnonKey = 'sb_publishable_ieNHfzN2ybCubu1jPkRY3Q_ggsFSrNn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});