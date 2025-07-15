
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;
type StoreInsert = TablesInsert<'stores'>;
type StoreUpdate = TablesUpdate<'stores'>;

export const useStores = () => {
  const { user, loading: authLoading } = useAuth();
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // Si pas de profil, retourner un tableau vide au lieu de créer automatiquement
        console.log('No profile found, returning empty stores array');
        return [];
      }

      // Maintenant récupérer les boutiques de ce profil
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('merchant_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stores:', error);
        throw error;
      }

      console.log('Stores fetched for profile:', profile.id, 'stores:', data);
      return data as Store[];
      } catch (error) {
        console.error('Error in stores query:', error);
        // Retourner un tableau vide en cas d'erreur pour éviter les crashes
        return [];
      }
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 minutes de cache
    cacheTime: 1000 * 60 * 30, // 30 minutes en cache
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile error:', profileError);
        throw new Error('Profile not found');
      }

      const { data, error } = await supabase
        .from('stores')
        .insert({ ...store, merchant_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
