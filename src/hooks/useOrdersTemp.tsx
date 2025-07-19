import { useQuery } from '@tanstack/react-query';

// Hook temporaire pour les commandes - retourne des données vides
export const useOrders = (storeId?: string) => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', storeId],
    queryFn: async () => {
      console.log('useOrders - Temporary hook, returning empty array');
      return [];
    },
    enabled: !!storeId,
  });

  return {
    orders: orders || [],
    isLoading,
    error: null,
    refetchOrders: () => {},
  };
};
