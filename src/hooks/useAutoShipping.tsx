import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook pour créer automatiquement les méthodes de livraison par défaut
 * pour toute nouvelle boutique (système multi-tenant)
 */
export const useAutoShipping = (storeId?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Méthodes de livraison par défaut pour toute nouvelle boutique
  const createDefaultShippingMethods = async (storeId: string) => {
    console.log('🚀 Création automatique des méthodes de livraison pour store:', storeId);
    
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

      // 2. Créer les zones de livraison par défaut
      console.log('🌍 Création des zones par défaut...');
      
      const defaultZones = [
        {
          store_id: storeId,
          name: 'Afrique de l\'Ouest',
          description: 'Mali, Sénégal, Burkina Faso, Côte d\'Ivoire, Niger, Togo, Bénin, Guinée',
          countries: ['ML', 'SN', 'BF', 'CI', 'NE', 'TG', 'BJ', 'GN'],
          is_active: true
        },
        {
          store_id: storeId,
          name: 'Afrique Centrale',
          description: 'Cameroun, Tchad, République Centrafricaine, Gabon, Congo, RDC',
          countries: ['CM', 'TD', 'CF', 'GA', 'CG', 'CD'],
          is_active: true
        },
        {
          store_id: storeId,
          name: 'Afrique du Nord',
          description: 'Algérie, Maroc, Tunisie',
          countries: ['DZ', 'MA', 'TN'],
          is_active: true
        }
      ];

      const { data: zones, error: zonesError } = await supabase
        .from('shipping_zones')
        .insert(defaultZones)
        .select();

      if (zonesError) {
        console.error('❌ Erreur création zones:', zonesError);
        throw zonesError;
      }

      console.log('✅ Zones créées:', zones?.length || 0);

      // 3. Créer les méthodes de livraison par défaut
      console.log('📦 Création des méthodes par défaut...');
      
      const defaultMethods = [
        // Méthodes globales (disponibles partout)
        {
          store_id: storeId,
          name: 'Livraison Standard',
          description: 'Livraison standard dans toute l\'Afrique francophone',
          price: 2500, // 2500 CFA
          estimated_days: '5-7 jours ouvrables',
          is_active: true,
          sort_order: 1,
          shipping_zone_id: null // Global
        },
        {
          store_id: storeId,
          name: 'Livraison Express',
          description: 'Livraison rapide dans toute l\'Afrique francophone',
          price: 5000, // 5000 CFA
          estimated_days: '2-3 jours ouvrables',
          is_active: true,
          sort_order: 2,
          shipping_zone_id: null // Global
        },
        
        // Méthode économique pour l'Afrique de l'Ouest
        {
          store_id: storeId,
          name: 'Livraison Économique Ouest',
          description: 'Livraison économique en Afrique de l\'Ouest',
          price: 1500, // 1500 CFA
          estimated_days: '7-10 jours ouvrables',
          is_active: true,
          sort_order: 3,
          shipping_zone_id: zones?.find(z => z.name === 'Afrique de l\'Ouest')?.id
        },
        
        // Livraison gratuite (promotion)
        {
          store_id: storeId,
          name: 'Livraison Gratuite',
          description: 'Livraison gratuite pour commandes supérieures à 50 000 CFA',
          price: 0, // Gratuit
          estimated_days: '10-14 jours ouvrables',
          is_active: true,
          sort_order: 4,
          shipping_zone_id: null // Global
        }
      ];

      const { data: methods, error: methodsError } = await supabase
        .from('shipping_methods')
        .insert(defaultMethods)
        .select();

      if (methodsError) {
        console.error('❌ Erreur création méthodes:', methodsError);
        throw methodsError;
      }

      console.log('✅ Méthodes créées:', methods?.length || 0);
      console.log('🎉 Configuration automatique terminée !');

      setIsInitialized(true);
      
      toast({
        title: "Livraisons configurées !",
        description: `${methods?.length || 0} méthodes de livraison créées automatiquement.`,
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
 * Hook pour récupérer les méthodes de livraison avec auto-création
 */
export const useShippingWithAutoSetup = (storeId?: string, countryCode?: string) => {
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createDefaultShippingMethods } = useAutoShipping(storeId);

  const loadShippingMethods = async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);
      console.log('🔍 Chargement méthodes pour store:', storeId, 'pays:', countryCode);

      // 1. Essayer de récupérer les méthodes existantes
      const { data: allMethods, error: methodsError } = await supabase
        .from('shipping_methods')
        .select(`
          *,
          shipping_zones(*)
        `)
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order');

      if (methodsError && methodsError.code !== 'PGRST116') {
        console.error('❌ Erreur récupération méthodes:', methodsError);
        return;
      }

      // 2. Si aucune méthode, créer automatiquement
      if (!allMethods || allMethods.length === 0) {
        console.log('🚀 Aucune méthode trouvée, création automatique...');
        const created = await createDefaultShippingMethods(storeId);
        
        if (created) {
          // Recharger après création
          setTimeout(() => loadShippingMethods(), 1000);
        }
        return;
      }

      // 3. Filtrer par pays si spécifié
      let availableMethods = allMethods;
      
      if (countryCode) {
        availableMethods = allMethods.filter(method => {
          // Méthodes globales (sans zone)
          if (!method.shipping_zone_id) {
            return true;
          }

          // Méthodes avec zone spécifique
          const zone = method.shipping_zones;
          return zone && zone.countries && zone.countries.includes(countryCode);
        });
      }

      console.log('✅ Méthodes disponibles:', availableMethods.length);
      setMethods(availableMethods);

    } catch (error) {
      console.error('💥 Erreur chargement méthodes:', error);
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
