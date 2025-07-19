// Fichier temporaire pour éviter les erreurs d'import
// TODO: Supprimer ce fichier une fois la migration vers Drizzle terminée

export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') })
      }),
      limit: () => Promise.resolve({ data: [], error: new Error('Supabase deprecated') })
    }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase deprecated') }),
    signOut: () => Promise.resolve({ error: new Error('Supabase deprecated') })
  }
};
