// apps/mobile/src/lib/supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do painel do Supabase
const supabaseUrl = 'https://lihpyhdgvbokechqvgvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaHB5aGRndmJva2VjaHF2Z3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjI5NDgsImV4cCI6MjA3MTk5ODk0OH0.eOunzzVcgCdEaSEhakTs180sdIueW2sGJmdp_2f_Hb8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});