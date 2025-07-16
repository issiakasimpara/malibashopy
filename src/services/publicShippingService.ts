import { supabase } from '@/integrations/supabase/client';
import { StoreShippingMethod } from '@/types/marketsShipping';

class PublicShippingService {
  // Récupérer les méthodes de livraison actives d'une boutique (pour les clients)
  async getActiveShippingMethods(storeSlug: string): Promise<StoreShippingMethod[]> {
    try {
      // D'abord récupérer l'ID de la boutique à partir du slug
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', storeSlug)
        .single();

      if (storeError || !storeData) {
        console.error('Boutique non trouvée:', storeError);
        return [];
      }

      // Ensuite récupérer les méthodes de livraison actives
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('store_id', storeData.id)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des méthodes de livraison:', error);
        return [];
      }

      // Mapper les données de la DB (snake_case) vers TypeScript (camelCase)
      return (data || []).map(item => ({
        id: item.id,
        storeId: item.store_id,
        name: item.name,
        description: item.description,
        price: item.price,
        estimatedDays: item.estimated_days,
        isActive: item.is_active,
        icon: item.icon,
        availableCountries: item.available_countries || [],
        conditions: item.conditions,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as StoreShippingMethod[];
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de livraison publiques:', error);
      return [];
    }
  }

  // Récupérer les méthodes de livraison disponibles pour un pays spécifique
  async getShippingMethodsForCountry(storeSlug: string, countryCode: string): Promise<StoreShippingMethod[]> {
    try {
      const allMethods = await this.getActiveShippingMethods(storeSlug);
      
      // Filtrer les méthodes disponibles pour ce pays
      return allMethods.filter(method => 
        !method.availableCountries || 
        method.availableCountries.length === 0 || 
        method.availableCountries.includes(countryCode)
      );
    } catch (error) {
      console.error('Erreur lors du filtrage des méthodes par pays:', error);
      return [];
    }
  }

  // Calculer les frais de livraison en fonction des conditions
  calculateShippingCost(method: StoreShippingMethod, orderTotal: number): number {
    if (!method.conditions) {
      return method.price;
    }

    const { minOrderAmount, freeShippingThreshold } = method.conditions;

    // Vérifier le montant minimum de commande
    if (minOrderAmount && orderTotal < minOrderAmount) {
      return -1; // Méthode non disponible
    }

    // Vérifier le seuil de livraison gratuite
    if (freeShippingThreshold && orderTotal >= freeShippingThreshold) {
      return 0; // Livraison gratuite
    }

    return method.price;
  }

  // Récupérer les méthodes de livraison avec calcul des coûts
  async getShippingOptionsWithCosts(
    storeSlug: string, 
    countryCode: string, 
    orderTotal: number
  ): Promise<Array<StoreShippingMethod & { calculatedPrice: number; isAvailable: boolean }>> {
    try {
      const methods = await this.getShippingMethodsForCountry(storeSlug, countryCode);
      
      return methods.map(method => {
        const calculatedPrice = this.calculateShippingCost(method, orderTotal);
        return {
          ...method,
          calculatedPrice: calculatedPrice >= 0 ? calculatedPrice : method.price,
          isAvailable: calculatedPrice >= 0
        };
      }).filter(method => method.isAvailable);
    } catch (error) {
      console.error('Erreur lors du calcul des coûts de livraison:', error);
      return [];
    }
  }
}

export const publicShippingService = new PublicShippingService();
