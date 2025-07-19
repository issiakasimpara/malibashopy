import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Configuration de la connexion PostgreSQL
const connectionString = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Créer la connexion PostgreSQL
const client = postgres(connectionString, {
  ssl: 'require',
  max: 1, // Limite les connexions pour éviter les problèmes
});

// Créer l'instance Drizzle
export const db = drizzle(client, { schema });

export type Database = typeof db;

// Réexport du schéma pour les types
export * from './schema';
