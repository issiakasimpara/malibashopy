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

      return data as MarketSettings | null;
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

      return data as MarketSettings;
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

      return (data || []) as StoreShippingMethod[];
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de livraison:', error);
      throw error;
    }
  }

  // Créer une nouvelle méthode de livraison
  async createShippingMethod(storeId: string, methodData: CreateShippingMethodData): Promise<StoreShippingMethod> {
    try {
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
          available_countries: methodData.availableCountries || [],
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as StoreShippingMethod;
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
          description: 'Livraison par transporteur local',
          price: 2500,
          estimatedDays: '3-7 jours',
          icon: '📦'
        },
        {
          name: 'Retrait en magasin',
          description: 'Récupération directe en boutique',
          price: 0,
          estimatedDays: 'Immédiat',
          icon: '🏪'
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
