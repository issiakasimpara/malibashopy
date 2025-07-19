// Hook temporaire pour les magasins - sera migré vers Drizzle
import { useState, useEffect } from 'react';

export interface Store {
  id: string;
  name: string;
  description?: string;
  slug: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulation de données temporaires
    setTimeout(() => {
      setStores([
        {
          id: '1',
          name: 'Mon Premier Magasin',
          description: 'Description du magasin',
          slug: 'mon-premier-magasin',
          user_id: 'user_1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const createStore = async (data: Partial<Store>) => {
    // Simulation de création
    console.log('Création de magasin:', data);
    return { id: Date.now().toString(), ...data } as Store;
  };

  const updateStore = async (id: string, data: Partial<Store>) => {
    // Simulation de mise à jour
    console.log('Mise à jour magasin:', id, data);
    return data as Store;
  };

  const deleteStore = async (id: string) => {
    // Simulation de suppression
    console.log('Suppression magasin:', id);
  };

  return {
    stores,
    isLoading,
    error,
    createStore,
    updateStore,
    deleteStore,
  };
}
