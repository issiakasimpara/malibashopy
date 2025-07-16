import { useQuery } from '@tanstack/react-query';
import { publicShippingService } from '@/services/publicShippingService';
import { StoreShippingMethod } from '@/types/marketsShipping';

export const usePublicShipping = (storeSlug?: string) => {
  // Récupérer toutes les méthodes de livraison actives
  const {
    data: shippingMethods = [],
    isLoading: isLoadingMethods,
    error: methodsError
  } = useQuery({
    queryKey: ['public-shipping-methods', storeSlug],
    queryFn: () => storeSlug ? publicShippingService.getActiveShippingMethods(storeSlug) : Promise.resolve([]),
    enabled: !!storeSlug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fonction pour récupérer les méthodes pour un pays spécifique
  const getMethodsForCountry = async (countryCode: string): Promise<StoreShippingMethod[]> => {
    if (!storeSlug) return [];
    return publicShippingService.getShippingMethodsForCountry(storeSlug, countryCode);
  };

  // Fonction pour récupérer les méthodes avec calcul des coûts
  const getShippingOptionsWithCosts = async (
    countryCode: string, 
    orderTotal: number
  ): Promise<Array<StoreShippingMethod & { calculatedPrice: number; isAvailable: boolean }>> => {
    if (!storeSlug) return [];
    return publicShippingService.getShippingOptionsWithCosts(storeSlug, countryCode, orderTotal);
  };

  // Calculer le coût de livraison pour une méthode spécifique
  const calculateShippingCost = (method: StoreShippingMethod, orderTotal: number): number => {
    return publicShippingService.calculateShippingCost(method, orderTotal);
  };

  return {
    // Data
    shippingMethods,
    
    // Loading states
    isLoadingMethods,
    
    // Errors
    methodsError,
    
    // Functions
    getMethodsForCountry,
    getShippingOptionsWithCosts,
    calculateShippingCost,
  };
};

// Hook spécialisé pour le checkout avec calcul automatique des coûts
export const useCheckoutShipping = (storeSlug?: string, countryCode?: string, orderTotal: number = 0) => {
  const {
    data: shippingOptions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['checkout-shipping-options', storeSlug, countryCode, orderTotal],
    queryFn: () => {
      if (!storeSlug || !countryCode) return Promise.resolve([]);
      return publicShippingService.getShippingOptionsWithCosts(storeSlug, countryCode, orderTotal);
    },
    enabled: !!storeSlug && !!countryCode && orderTotal > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes (plus court car dépend du total)
  });

  return {
    shippingOptions,
    isLoading,
    error,
    hasShippingOptions: shippingOptions.length > 0
  };
};
