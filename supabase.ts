import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Fix: Using process.env instead of import.meta.env to resolve TypeScript error 'Property env does not exist on type ImportMeta'.
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Inicializamos el cliente solo si las llaves existen para evitar errores en local
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper para verificar si la DB está conectada
export const isDbConnected = () => !!supabase;