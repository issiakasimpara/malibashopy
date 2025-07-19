import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderData, Order } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';

export const useOrders = () => {
  const { store } = useStores();
  const { toast } = useToast();
  const queryClient = useQueryClient();



  // Récupérer les commandes de la boutique
  const {
    data: orders = [],
    isLoading,
    error,
    refetch: refetchOrders
  } = useQuery({
    queryKey: ['orders', store?.id],
    queryFn: () => store?.id ? orderService.getStoreOrders(store.id) : Promise.resolve([]),
    enabled: !!store?.id,
    // ⚡ OPTIMISATION: Commandes moins fréquentes mais plus intelligentes
    refetchInterval: 2 * 60 * 1000, // 2 minutes au lieu de 30 secondes
    staleTime: 60 * 1000, // 1 minute de cache au lieu de 10 secondes
    cacheTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    refetchOnWindowFocus: true, // Garder le focus pour les commandes (important)
    refetchOnMount: false,
    // Retry intelligent pour les commandes critiques
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Récupérer les statistiques
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['store-stats', store?.id],
    queryFn: () => store?.id ? orderService.getStoreStats(store.id) : Promise.resolve(null),
    enabled: !!store?.id,
    // ⚡ OPTIMISATION: Stats moins critiques
    refetchInterval: 5 * 60 * 1000, // 5 minutes pour les stats
    staleTime: 2 * 60 * 1000, // 2 minutes de cache
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Créer une commande
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // 1. Créer la commande
      const newOrder = await orderService.createOrder(orderData);

      console.log('✅ Commande créée avec succès:', newOrder.order_number);

      return newOrder;
    },
    onSuccess: (newOrder) => {
      console.log('✅ Commande créée avec succès:', newOrder);

      // Mettre à jour le cache des commandes
      queryClient.setQueryData(['orders', newOrder.store_id], (old: Order[] = []) => {
        return [newOrder, ...old];
      });

      // Invalider les statistiques pour les recalculer
      queryClient.invalidateQueries({ queryKey: ['store-stats', newOrder.store_id] });

      toast({
        title: "Commande créée !",
        description: `Commande ${newOrder.order_number} créée avec succès.`,
      });
    },
    onError: (error: any) => {
      console.error('❌ Erreur création commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mettre à jour le statut d'une commande
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: (updatedOrder) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['orders', updatedOrder.store_id], (old: Order[] = []) => {
        return old.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        );
      });

      // Invalider les statistiques
      queryClient.invalidateQueries({ queryKey: ['store-stats', updatedOrder.store_id] });

      toast({
        title: "Statut mis à jour",
        description: `Commande ${updatedOrder.order_number} mise à jour.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mettre à jour le statut de paiement
  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updatePaymentStatus(orderId, status),
    onSuccess: (updatedOrder) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['orders', updatedOrder.store_id], (old: Order[] = []) => {
        return old.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        );
      });

      // Invalider les statistiques
      queryClient.invalidateQueries({ queryKey: ['store-stats', updatedOrder.store_id] });

      toast({
        title: "Paiement mis à jour",
        description: `Paiement de la commande ${updatedOrder.order_number} mis à jour.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    // Données
    orders,
    stats,
    
    // États de chargement
    isLoading,
    isLoadingStats,
    isCreating: createOrderMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    isUpdatingPayment: updatePaymentStatusMutation.isPending,
    
    // Erreurs
    error,
    
    // Actions
    createOrder: createOrderMutation.mutate,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    updatePaymentStatus: updatePaymentStatusMutation.mutate,
    refetchOrders,
    refetchStats,
    
    // Utilitaires
    getOrderById: (orderId: string) => orders.find(order => order.id === orderId),
    getOrdersByStatus: (status: string) =>
      orders.filter(order => order.status === status),
    getTodayOrders: () => {
      const today = new Date().toISOString().split('T')[0];
      return orders.filter(order => order.created_at.startsWith(today));
    }
  };
};

// Hook pour les commandes clients (côté public)
export const useCustomerOrders = (email?: string) => {
  const { toast } = useToast();

  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['customer-orders', email],
    queryFn: () => email ? orderService.getCustomerOrders(email) : Promise.resolve([]),
    enabled: !!email,
    staleTime: 60000, // 1 minute
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    getOrderByNumber: (orderNumber: string) => 
      orders.find(order => order.order_number === orderNumber)
  };
};
