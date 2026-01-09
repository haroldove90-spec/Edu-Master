import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * Obtiene variables de entorno de forma segura intentando múltiples métodos
 * para máxima compatibilidad con Vercel, Vite y otros entornos.
 */
const getSafeEnv = (key: string): string => {
  try {
    // Intento estilo Vite (Estándar para Vercel)
    // Fix: Accessing .env on import.meta by casting to any to bypass strict type checking
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
    
    // Intento estilo Process (Node.js / Polyfills)
    // Fix: Accessing .env on process by casting to any to bypass strict type checking
    if (typeof process !== 'undefined' && (process as any).env && (process as any).env[key]) {
      return (process as any).env[key];
    }
  } catch (e) {
    console.warn(`Aviso: Error al acceder a ${key}:`, e);
  }
  return '';
};

const supabaseUrl = getSafeEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('VITE_SUPABASE_ANON_KEY');

// Inicializamos el cliente solo si las llaves existen
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper para verificar conexión
export const isDbConnected = () => {
  if (!supabase) {
    console.info("Info: Corriendo en modo offline/local (No se detectaron llaves de Supabase).");
    return false;
  }
  return true;
};