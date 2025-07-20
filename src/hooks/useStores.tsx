
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, stores, profiles } from '@/db';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { eq, desc } from 'drizzle-orm';

type Store = typeof stores.$inferSelect;
type StoreInsert = typeof stores.$inferInsert;
type StoreUpdate = Partial<StoreInsert>;

export const useStores = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stores, isLoading, refetch } = useQuery({
    queryKey: ['stores', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, returning empty array');
        return [];
      }

      console.log('Fetching stores for user:', user.email);

      try {
        // D'abord récupérer le profil de l'utilisateur
        const profile = await db
          .select({ id: profiles.id })
          .from(profiles)
          .where(eq(profiles.userId, user.id))
          .limit(1);

        if (!profile.length) {
          console.log('No profile found, returning empty stores array');
          return [];
        }

        // Maintenant récupérer les boutiques de ce profil
        const storesResult = await db
          .select()
          .from(stores)
          .where(eq(stores.merchantId, profile[0].id))
          .orderBy(desc(stores.createdAt));

        console.log('Stores fetched for profile:', profile[0].id, 'stores:', storesResult);
        return storesResult as Store[];
      } catch (error) {
        console.error('Error in stores query:', error);
        // Retourner un tableau vide en cas d'erreur pour éviter les crashes
        return [];
      }
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 minutes de cache
    retry: 1, // Réduire les tentatives
    refetchOnWindowFocus: false, // Éviter les requêtes inutiles
  });

  // Get the single store (since users can only have one)
  const store = stores?.[0] || null;
  const hasStore = !!store;

  const createStore = useMutation({
    mutationFn: async (store: Omit<StoreInsert, 'merchant_id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Check if user already has a store
      if (hasStore) {
        throw new Error('Vous ne pouvez créer qu\'une seule boutique par compte');
      }

      // First get the user's profile
      const profile = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1);

      if (!profile.length) {
        throw new Error('Profile not found');
      }

      const newStore = await db
        .insert(stores)
        .values({ ...store, merchantId: profile[0].id })
        .returning();

      return newStore[0];
    },
    onSuccess: (newStore) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Boutique créée !",
        description: "Votre boutique a été créée avec succès.",
      });
      return newStore;
    },
    onError: (error) => {
      console.error('Store creation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la boutique. " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateStore = useMutation({
    mutationFn: async ({ id, ...updates }: StoreUpdate & { id: string }) => {
      const updatedStore = await db
        .update(stores)
        .set(updates)
        .where(eq(stores.id, id))
        .returning();

      return updatedStore[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Boutique mise à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
    },
    onError: (error) => {
      console.error('Store update error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la boutique. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    stores: stores || [],
    store, // Single store
    hasStore, // Boolean to check if user has a store
    isLoading: isLoading || authLoading,
    createStore: createStore.mutateAsync,
    updateStore: updateStore.mutate,
    isCreating: createStore.isPending,
    isUpdating: updateStore.isPending,
    refetchStores: refetch,
  };
};
