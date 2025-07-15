import { useQuery } from '@tanstack/react-query';
import { analyticsService, AnalyticsData } from '@/services/analyticsService';
import { useStores } from './useStores';

export const useAnalytics = () => {
  const { store } = useStores();

  // Récupérer les analytics de la boutique
  const {
    data: analytics,
    isLoading,
    error,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['analytics', store?.id],
    queryFn: () => store?.id ? analyticsService.getStoreAnalytics(store.id) : Promise.resolve({
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      topProducts: [],
      revenueByMonth: [],
      ordersByStatus: []
    } as AnalyticsData),
    enabled: !!store?.id,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
    staleTime: 30000, // Considérer les données comme fraîches pendant 30 secondes
  });

  return {
    analytics,
    isLoading,
    error,
    refetchAnalytics,
    
    // Utilitaires
    getTotalRevenue: () => analytics?.totalRevenue || 0,
    getTotalOrders: () => analytics?.totalOrders || 0,
    getTotalCustomers: () => analytics?.totalCustomers || 0,
    getAverageOrderValue: () => analytics?.averageOrderValue || 0,
    getRevenueGrowth: () => analytics?.revenueGrowth || 0,
    getOrdersGrowth: () => analytics?.ordersGrowth || 0,
    getCustomersGrowth: () => analytics?.customersGrowth || 0,
    getTopProducts: () => analytics?.topProducts || [],
    getRevenueByMonth: () => analytics?.revenueByMonth || [],
    getOrdersByStatus: () => analytics?.ordersByStatus || []
  };
};
