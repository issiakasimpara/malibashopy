import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Truck, 
  Plus, 
  Settings, 
  MapPin,
  Package,
  RefreshCw
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';
import { AFRICAN_FRANCOPHONE_COUNTRIES } from '@/constants/africanCountries';
import MarketSettingsForm from '@/components/markets-shipping/MarketSettingsForm';
import ShippingMethodsList from '@/components/markets-shipping/ShippingMethodsList';
import CreateShippingMethodModal from '@/components/markets-shipping/CreateShippingMethodModal';

const MarketsShipping = () => {
  const { store } = useStores();
  const {
    marketSettings,
    shippingMethods,
    isLoading,
    initializeDefaultSettings,
    isInitializing
  } = useMarketsShipping(store?.id);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('markets');

  const handleInitializeDefaults = () => {
    if (store?.id) {
      initializeDefaultSettings(store.id);
    }
  };

  const enabledCountriesCount = marketSettings?.enabledCountries?.length || 0;
  const activeShippingMethodsCount = shippingMethods.filter(method => method.isActive).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Marchés et Livraisons
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos marchés de vente et vos méthodes de livraison
            </p>
          </div>
          {!marketSettings && (
            <Button
              onClick={handleInitializeDefaults}
              disabled={isInitializing}
              className="flex items-center gap-2"
            >
              {isInitializing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              Initialiser les paramètres
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Marchés actifs
                  </p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {enabledCountriesCount}
                  </p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                    pays disponibles
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Méthodes de livraison
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {activeShippingMethodsCount}
                  </p>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70">
                    méthodes actives
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Couverture
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {Math.round((enabledCountriesCount / AFRICAN_FRANCOPHONE_COUNTRIES.length) * 100)}%
                  </p>
                  <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
                    de l'Afrique francophone
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="markets" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Marchés de vente
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Méthodes de livraison
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="markets" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Configuration des marchés
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sélectionnez les pays où vous souhaitez vendre vos produits
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
                  </div>
                ) : (
                  <MarketSettingsForm 
                    marketSettings={marketSettings}
                    storeId={store?.id}
                  />
                )}
              </TabsContent>

              <TabsContent value="shipping" className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Méthodes de livraison
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Configurez vos options de livraison et leurs tarifs
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une méthode
                  </Button>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
                  </div>
                ) : (
                  <ShippingMethodsList 
                    shippingMethods={shippingMethods}
                    storeId={store?.id}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Shipping Method Modal */}
        <CreateShippingMethodModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          storeId={store?.id}
        />
      </div>
    </DashboardLayout>
  );
};

export default MarketsShipping;
