import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// 🔐 Récupération de l'URL de la base de données (côté client uniquement)
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('🚨 DATABASE_URL is required');
}

// 🔗 Connexion Neon
const sql = neon(databaseUrl);

// 🗄️ Instance Drizzle avec schéma
export const db = drizzle(sql, { schema });

// 📋 Export des types pour TypeScript
export type Database = typeof db;
export * from './schema';
