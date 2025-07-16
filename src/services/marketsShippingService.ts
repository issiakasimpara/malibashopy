import { supabase } from '@/integrations/supabase/client';
import { 
  MarketSettings, 
  StoreShippingMethod, 
  CreateShippingMethodData,
  UpdateMarketSettingsData 
} from '@/types/marketsShipping';

class MarketsShippingService {
  // Récupérer les paramètres de marché d'une boutique
  async getMarketSettings(storeId: string): Promise<MarketSettings | null> {
    try {
      const { data, error } = await supabase
        .from('market_settings')
        .select('*')
        .eq('store_id', storeId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) return null;

      // Mapper les données de la DB (snake_case) vers TypeScript (camelCase)
      return {
        id: data.id,
        storeId: data.store_id,
        enabledCountries: data.enabled_countries || [],
        defaultCurrency: data.default_currency,
        taxSettings: data.tax_settings,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as MarketSettings;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de marché:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour les paramètres de marché
  async updateMarketSettings(storeId: string, settings: UpdateMarketSettingsData): Promise<MarketSettings> {
    try {
      const { data, error } = await supabase
        .from('market_settings')
        .upsert({
          store_id: storeId,
          enabled_countries: settings.enabledCountries,
          default_currency: settings.defaultCurrency,
          tax_settings: settings.taxSettings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Mapper les données de retour
      return {
        id: data.id,
        storeId: data.store_id,
        enabledCountries: data.enabled_countries || [],
        defaultCurrency: data.default_currency,
        taxSettings: data.tax_settings,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as MarketSettings;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de marché:', error);
      throw error;
    }
  }

  // Récupérer les méthodes de livraison d'une boutique
  async getShippingMethods(storeId: string): Promise<StoreShippingMethod[]> {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
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
      console.error('Erreur lors de la récupération des méthodes de livraison:', error);
      throw error;
    }
  }

  // Créer une nouvelle méthode de livraison
  async createShippingMethod(storeId: string, methodData: CreateShippingMethodData): Promise<StoreShippingMethod> {
    try {
      // Pour l'instant, on ignore available_countries car le champ n'existe pas encore
      const { data, error } = await supabase
        .from('shipping_methods')
        .insert({
          store_id: storeId,
          name: methodData.name,
          description: methodData.description,
          price: methodData.price,
          estimated_days: methodData.estimatedDays,
          icon: methodData.icon,
          conditions: methodData.conditions || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Mapper les données de retour
      return {
        id: data.id,
        storeId: data.store_id,
        name: data.name,
        description: data.description,
        price: data.price,
        estimatedDays: data.estimated_days,
        isActive: data.is_active,
        icon: data.icon,
        availableCountries: methodData.availableCountries || [],
        conditions: data.conditions,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as StoreShippingMethod;
    } catch (error) {
      console.error('Erreur lors de la création de la méthode de livraison:', error);
      throw error;
    }
  }

  // Mettre à jour une méthode de livraison
  async updateShippingMethod(methodId: string, methodData: Partial<CreateShippingMethodData>): Promise<StoreShippingMethod> {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .update({
          ...methodData,
          updated_at: new Date().toISOString()
        })
        .eq('id', methodId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as StoreShippingMethod;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la méthode de livraison:', error);
      throw error;
    }
  }

  // Supprimer une méthode de livraison
  async deleteShippingMethod(methodId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('shipping_methods')
        .delete()
        .eq('id', methodId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la méthode de livraison:', error);
      throw error;
    }
  }

  // Activer/désactiver une méthode de livraison
  async toggleShippingMethodStatus(methodId: string, isActive: boolean): Promise<StoreShippingMethod> {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', methodId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as StoreShippingMethod;
    } catch (error) {
      console.error('Erreur lors du changement de statut de la méthode de livraison:', error);
      throw error;
    }
  }

  // Initialiser les paramètres par défaut pour une nouvelle boutique
  async initializeDefaultSettings(storeId: string): Promise<void> {
    try {
      // Créer les paramètres de marché par défaut
      await this.updateMarketSettings(storeId, {
        enabledCountries: ['BF', 'CI', 'SN'], // Pays par défaut
        defaultCurrency: 'XOF',
        taxSettings: {
          includeTax: false,
          taxRate: 0,
          taxLabel: 'TVA'
        }
      });

      // Créer les méthodes de livraison par défaut
      const defaultMethods: CreateShippingMethodData[] = [
        {
          name: 'Livraison standard',
          description: 'Livraison par transporteur local dans les principales villes',
          price: 2500,
          estimatedDays: '3-7 jours',
          icon: '📦',
          availableCountries: ['BF', 'CI', 'SN']
        },
        {
          name: 'Livraison express',
          description: 'Livraison rapide en 24-48h',
          price: 5000,
          estimatedDays: '1-2 jours',
          icon: '⚡',
          availableCountries: ['BF', 'CI', 'SN']
        },
        {
          name: 'Retrait en magasin',
          description: 'Récupération directe en boutique',
          price: 0,
          estimatedDays: 'Immédiat',
          icon: '🏪',
          availableCountries: ['BF', 'CI', 'SN']
        }
      ];

      for (const method of defaultMethods) {
        await this.createShippingMethod(storeId, method);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des paramètres par défaut:', error);
      throw error;
    }
  }
}

export const marketsShippingService = new MarketsShippingService();
