
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, stores } from '@/db';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { eq, desc } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

type Store = InferSelectModel<typeof stores>;
type StoreInsert = InferInsertModel<typeof stores>;
type StoreUpdate = Partial<StoreInsert>;

export const useStores = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userStores, isLoading, refetch } = useQuery({
    queryKey: ['stores', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user found, returning empty array');
        return [];
      }

      console.log('Fetching stores for user:', user.id);

      try {
        const data = await db
          .select()
          .from(stores)
          .where(eq(stores.ownerId, user.id))
          .orderBy(desc(stores.createdAt));

        console.log('Stores fetched:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Error in stores query:', error);
        return [];
      }
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 minutes de cache
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Get the single store (since users can only have one)
  const store = userStores?.[0] || null;
  const hasStore = !!store;

  const createStore = useMutation({
    mutationFn: async (storeData: Omit<StoreInsert, 'ownerId'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check if user already has a store
      if (hasStore) {
        throw new Error('Vous ne pouvez créer qu\'une seule boutique par compte');
      }

      const [newStore] = await db
        .insert(stores)
        .values({ ...storeData, ownerId: user.id })
        .returning();

      return newStore;
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
      const [updatedStore] = await db
        .update(stores)
        .set(updates)
        .where(eq(stores.id, id))
        .returning();

      return updatedStore;
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
    stores: userStores || [],
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
