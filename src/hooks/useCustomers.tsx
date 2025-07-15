import { useQuery } from '@tanstack/react-query';
import { customerService, Customer, CustomerStats } from '@/services/customerService';
import { useStores } from './useStores';

export const useCustomers = () => {
  const { store } = useStores();

  // Récupérer les clients de la boutique
  const {
    data: customers = [],
    isLoading,
    error,
    refetch: refetchCustomers
  } = useQuery({
    queryKey: ['customers', store?.id],
    queryFn: () => store?.id ? customerService.getStoreCustomers(store.id) : Promise.resolve([]),
    enabled: !!store?.id,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
    staleTime: 30000, // Considérer les données comme fraîches pendant 30 secondes
  });

  // Récupérer les statistiques des clients
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['customer-stats', store?.id],
    queryFn: () => store?.id ? customerService.getCustomerStats(store.id) : Promise.resolve({
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      activeCustomers: 0,
      averageOrderValue: 0
    }),
    enabled: !!store?.id,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  return {
    customers,
    stats,
    isLoading,
    isLoadingStats,
    error,
    statsError,
    refetchCustomers,
    refetchStats,
    
    // Utilitaires
    getCustomerByEmail: (email: string) => 
      customers.find(customer => customer.email.toLowerCase() === email.toLowerCase()),
    getTopCustomers: (limit: number = 10) => 
      customers.slice(0, limit),
    getActiveCustomers: () => 
      customers.filter(customer => customer.status === 'active'),
    getNewCustomers: (days: number = 30) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return customers.filter(customer => 
        new Date(customer.firstOrderDate) >= cutoffDate
      );
    }
  };
};
