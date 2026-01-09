
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Detectar el entorno de forma segura para evitar ReferenceError: process is not defined
const getEnv = (key: string): string => {
  // Fix: Cast import.meta to any to access environment variables from build tools like Vite/Vercel which might not be in the default ImportMeta types.
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta.env) {
    return meta.env[key] || '';
  }
  // Fix: Use a safe check for the process global and cast to any to bypass potential environment-specific type missing errors.
  const proc = typeof process !== 'undefined' ? (process as any) : null;
  if (proc && proc.env) {
    return proc.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Inicializamos el cliente solo si las llaves existen para evitar errores en local
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper para verificar si la DB está conectada
export const isDbConnected = () => !!supabase;
