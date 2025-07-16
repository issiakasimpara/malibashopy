import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CreateStoreDialog from '@/components/CreateStoreDialog';
import { useShipping } from '@/hooks/useShipping';
import { useStores } from '@/hooks/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Truck, 
  Plus, 
  Package, 
  MapPin, 
  DollarSign, 
  Clock,
  Settings,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import ShippingMethodsList from '@/components/shipping/ShippingMethodsList';
import ShippingZonesList from '@/components/shipping/ShippingZonesList';
import CreateShippingMethodModal from '@/components/shipping/CreateShippingMethodModal';
import CreateShippingZoneModal from '@/components/shipping/CreateShippingZoneModal';
import ShippingStats from '@/components/shipping/ShippingStats';
import NoStoreSelected from '@/components/products/NoStoreSelected';
import InitializeShippingTables from '@/components/shipping/InitializeShippingTables';

const Shipping = () => {
  const { stores, isLoading: isLoadingStores } = useStores();
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [showCreateMethod, setShowCreateMethod] = useState(false);
  const [showCreateZone, setShowCreateZone] = useState(false);
  const [activeTab, setActiveTab] = useState<'methods' | 'zones' | 'stats' | 'init'>('init');

  const {
    methods,
    zones,
    stats,
    isLoading,
    createMethod,
    updateMethod,
    deleteMethod,
    createZone,
    updateZone,
    deleteZone,
    refetch
  } = useShipping(selectedStoreId);

  const handleStoreCreated = (newStore: any) => {
    setSelectedStoreId(newStore.id);
    setShowCreateStore(false);
  };

  const selectedStore = stores?.find(store => store.id === selectedStoreId);

  if (isLoadingStores) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header avec gradient moderne */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 rounded-3xl" />
          <div className="relative p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Livraisons
                  </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                  Gérez vos zones et méthodes de livraison
                </p>
                
                {selectedStore && (
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Package className="h-3 w-3 mr-1" />
                      {selectedStore.name}
                    </Badge>
                    {stats && (
                      <>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {stats.activeMethods} méthodes actives
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {stats.activeZones} zones actives
                        </Badge>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sélecteur de boutique */}
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="px-4 py-2 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une boutique</option>
                  {stores?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>

                {!stores?.length ? (
                  <Button onClick={() => setShowCreateStore(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une boutique
                  </Button>
                ) : selectedStoreId && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowCreateZone(true)}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Nouvelle zone
                    </Button>
                    <Button 
                      onClick={() => setShowCreateMethod(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle méthode
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {selectedStoreId ? (
            <div className="space-y-6">
              {/* Onglets de navigation */}
              <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={activeTab === 'init' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('init')}
                    className={activeTab === 'init' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Initialisation
                  </Button>
                  <Button
                    variant={activeTab === 'methods' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('methods')}
                    className={activeTab === 'methods' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Méthodes de livraison
                  </Button>
                  <Button
                    variant={activeTab === 'zones' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('zones')}
                    className={activeTab === 'zones' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Zones de livraison
                  </Button>
                  <Button
                    variant={activeTab === 'stats' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('stats')}
                    className={activeTab === 'stats' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistiques
                  </Button>
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'init' && (
                  <InitializeShippingTables />
                )}

                {activeTab === 'methods' && (
                  <ShippingMethodsList
                    methods={methods}
                    zones={zones}
                    isLoading={isLoading}
                    onEdit={(method) => {
                      // TODO: Implémenter l'édition
                      console.log('Edit method:', method);
                    }}
                    onDelete={(id) => deleteMethod.mutate(id)}
                    onAdd={() => setShowCreateMethod(true)}
                  />
                )}

                {activeTab === 'zones' && (
                  <ShippingZonesList
                    zones={zones}
                    isLoading={isLoading}
                    onEdit={(zone) => {
                      // TODO: Implémenter l'édition
                      console.log('Edit zone:', zone);
                    }}
                    onDelete={(id) => deleteZone.mutate(id)}
                    onAdd={() => setShowCreateZone(true)}
                  />
                )}

                {activeTab === 'stats' && (
                  <ShippingStats
                    stats={stats}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg p-8">
              <NoStoreSelected />
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateStoreDialog 
        open={showCreateStore} 
        onOpenChange={setShowCreateStore}
        onStoreCreated={handleStoreCreated}
      />

      <CreateShippingMethodModal
        open={showCreateMethod}
        onOpenChange={setShowCreateMethod}
        storeId={selectedStoreId}
        zones={zones}
        onMethodCreated={(method) => {
          createMethod.mutate(method);
          setShowCreateMethod(false);
        }}
      />

      <CreateShippingZoneModal
        open={showCreateZone}
        onOpenChange={setShowCreateZone}
        storeId={selectedStoreId}
        onZoneCreated={(zone) => {
          createZone.mutate(zone);
          setShowCreateZone(false);
        }}
      />
    </DashboardLayout>
  );
};

export default Shipping;
