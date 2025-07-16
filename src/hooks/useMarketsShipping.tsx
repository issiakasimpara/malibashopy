import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { marketsShippingService } from '@/services/marketsShippingService';
import { CreateShippingMethodData, UpdateMarketSettingsData } from '@/types/marketsShipping';

export const useMarketsShipping = (storeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les paramètres de marché
  const {
    data: marketSettings,
    isLoading: isLoadingMarketSettings,
    error: marketSettingsError
  } = useQuery({
    queryKey: ['market-settings', storeId],
    queryFn: () => storeId ? marketsShippingService.getMarketSettings(storeId) : Promise.resolve(null),
    enabled: !!storeId,
  });

  // Récupérer les méthodes de livraison
  const {
    data: shippingMethods = [],
    isLoading: isLoadingShippingMethods,
    error: shippingMethodsError
  } = useQuery({
    queryKey: ['shipping-methods', storeId],
    queryFn: () => storeId ? marketsShippingService.getShippingMethods(storeId) : Promise.resolve([]),
    enabled: !!storeId,
  });

  // Mettre à jour les paramètres de marché
  const updateMarketSettingsMutation = useMutation({
    mutationFn: ({ storeId, settings }: { storeId: string; settings: UpdateMarketSettingsData }) =>
      marketsShippingService.updateMarketSettings(storeId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-settings', storeId] });
      toast({
        title: 'Succès',
        description: 'Les paramètres de marché ont été mis à jour.',
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des paramètres de marché:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres de marché.',
        variant: 'destructive',
      });
    },
  });

  // Créer une méthode de livraison
  const createShippingMethodMutation = useMutation({
    mutationFn: ({ storeId, methodData }: { storeId: string; methodData: CreateShippingMethodData }) =>
      marketsShippingService.createShippingMethod(storeId, methodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: 'Succès',
        description: 'La méthode de livraison a été créée.',
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création de la méthode de livraison:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la méthode de livraison.',
        variant: 'destructive',
      });
    },
  });

  // Mettre à jour une méthode de livraison
  const updateShippingMethodMutation = useMutation({
    mutationFn: ({ methodId, methodData }: { methodId: string; methodData: Partial<CreateShippingMethodData> }) =>
      marketsShippingService.updateShippingMethod(methodId, methodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: 'Succès',
        description: 'La méthode de livraison a été mise à jour.',
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la méthode de livraison:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la méthode de livraison.',
        variant: 'destructive',
      });
    },
  });

  // Supprimer une méthode de livraison
  const deleteShippingMethodMutation = useMutation({
    mutationFn: (methodId: string) => marketsShippingService.deleteShippingMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: 'Succès',
        description: 'La méthode de livraison a été supprimée.',
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression de la méthode de livraison:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la méthode de livraison.',
        variant: 'destructive',
      });
    },
  });

  // Activer/désactiver une méthode de livraison
  const toggleShippingMethodMutation = useMutation({
    mutationFn: ({ methodId, isActive }: { methodId: string; isActive: boolean }) =>
      marketsShippingService.toggleShippingMethodStatus(methodId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: 'Succès',
        description: 'Le statut de la méthode de livraison a été mis à jour.',
      });
    },
    onError: (error) => {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de changer le statut de la méthode de livraison.',
        variant: 'destructive',
      });
    },
  });

  // Initialiser les paramètres par défaut
  const initializeDefaultSettingsMutation = useMutation({
    mutationFn: (storeId: string) => marketsShippingService.initializeDefaultSettings(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-settings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: 'Succès',
        description: 'Les paramètres par défaut ont été initialisés.',
      });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'initialisation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'initialiser les paramètres par défaut.',
        variant: 'destructive',
      });
    },
  });

  // Computed values
  const enabledCountriesCount = marketSettings?.enabled_countries?.length || 0;
  const activeShippingMethodsCount = shippingMethods.filter(method => method.is_active).length;

  return {
    // Data
    marketSettings,
    shippingMethods,

    // Computed values
    enabledCountriesCount,
    activeShippingMethodsCount,

    // Loading states
    isLoadingMarketSettings,
    isLoadingShippingMethods,
    isLoading: isLoadingMarketSettings || isLoadingShippingMethods,

    // Errors
    marketSettingsError,
    shippingMethodsError,

    // Mutations
    updateMarketSettings: updateMarketSettingsMutation.mutate,
    createShippingMethod: createShippingMethodMutation.mutate,
    updateShippingMethod: updateShippingMethodMutation.mutate,
    deleteShippingMethod: deleteShippingMethodMutation.mutate,
    toggleShippingMethod: toggleShippingMethodMutation.mutate,
    initializeDefaultSettings: initializeDefaultSettingsMutation.mutate,

    // Mutation states
    isUpdatingMarketSettings: updateMarketSettingsMutation.isPending,
    isCreatingShippingMethod: createShippingMethodMutation.isPending,
    isUpdatingShippingMethod: updateShippingMethodMutation.isPending,
    isDeletingShippingMethod: deleteShippingMethodMutation.isPending,
    isTogglingShippingMethod: toggleShippingMethodMutation.isPending,
    isInitializing: initializeDefaultSettingsMutation.isPending,
  };
};
