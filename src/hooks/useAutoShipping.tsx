import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook pour créer automatiquement les méthodes de livraison par défaut
 * NOUVELLE VERSION AVEC TOUTE L'AFRIQUE
 */
export const useAutoShipping = (storeId?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Créer les zones et méthodes complètes pour toute l'Afrique
  const createDefaultShippingMethods = async (storeId: string) => {
    console.log('🚀 Création automatique COMPLÈTE pour toute l\'Afrique - Store:', storeId);

    try {
      setIsLoading(true);

      // 1. Vérifier si des méthodes existent déjà
      const { data: existingMethods, error: checkError } = await supabase
        .from('shipping_methods')
        .select('id')
        .eq('store_id', storeId)
        .limit(1);

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('⚠️ Erreur vérification méthodes existantes:', checkError);
        // Continuer quand même
      }

      if (existingMethods && existingMethods.length > 0) {
        console.log('✅ Méthodes de livraison déjà configurées pour cette boutique');
        setIsInitialized(true);
        return true;
      }

      // 2. Utiliser la fonction SQL pour créer toutes les zones et méthodes
      console.log('🌍 Création complète via fonction SQL...');
      const { data: result, error: functionError } = await supabase
        .rpc('create_default_shipping_for_store', { store_uuid: storeId });

      if (functionError) {
        console.error('❌ Erreur fonction SQL:', functionError);
        throw functionError;
      }

      console.log('✅ Résultat création:', result);
      setIsInitialized(true);

      toast({
        title: "Livraisons configurées !",
        description: "Toutes les zones d'Afrique et méthodes de livraison ont été créées automatiquement.",
      });

      return true;



    } catch (error) {
      console.error('💥 Erreur configuration automatique:', error);
      
      toast({
        title: "Erreur configuration",
        description: "Impossible de configurer les livraisons automatiquement.",
        variant: "destructive"
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-initialisation quand un storeId est fourni
  useEffect(() => {
    if (storeId && !isInitialized && !isLoading) {
      createDefaultShippingMethods(storeId);
    }
  }, [storeId, isInitialized, isLoading]);

  return {
    isInitialized,
    isLoading,
    createDefaultShippingMethods
  };
};

/**
 * Hook simple pour récupérer les méthodes de livraison de l'admin
 * VERSION PROPRE - RESTART FROM ZERO
 */
export const useShippingWithAutoSetup = (storeId?: string, countryCode?: string) => {
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadShippingMethods = async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);
      console.log('🚚 Chargement méthodes pour boutique:', storeId);

      // Récupérer les méthodes de cette boutique
      const { data: shippingMethods, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('❌ Erreur:', error);
        setMethods([]);
        return;
      }

      console.log('✅ Méthodes trouvées:', shippingMethods?.length || 0);
      setMethods(shippingMethods || []);

    } catch (error) {
      console.error('💥 Erreur:', error);
      setMethods([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShippingMethods();
  }, [storeId, countryCode]);

  return {
    methods,
    isLoading,
    reload: loadShippingMethods
  };
};
