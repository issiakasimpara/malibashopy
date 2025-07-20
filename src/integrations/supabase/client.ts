// 🔐 CLIENT NEON SÉCURISÉ
import { db } from '@/db';

// 🔍 Log de débogage (uniquement en développement)
if (import.meta.env.DEV) {
  console.log('🔐 Neon client initialisé:', {
    database: 'Neon PostgreSQL',
    env: import.meta.env.VITE_APP_ENV
  });
}

// Export du client de base de données Neon
export const supabase = db;