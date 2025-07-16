import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CreateStoreDialog from '@/components/CreateStoreDialog';
import { useStores } from '@/hooks/useStores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Truck,
  Settings,
  Store,
  Plus,
  MapPin,
  Package,
  Edit,
  Trash2,
  Globe,
  DollarSign,
  Clock
} from 'lucide-react';
import NoStoreSelected from '@/components/products/NoStoreSelected';
import CreateZoneDialog from '@/components/shipping/CreateZoneDialog';
import CreateMethodDialog from '@/components/shipping/CreateMethodDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Shipping = () => {
  const { stores, isLoading: isLoadingStores } = useStores();
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [activeTab, setActiveTab] = useState<'zones' | 'methods'>('zones');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateZone, setShowCreateZone] = useState(false);
  const [showCreateMethod, setShowCreateMethod] = useState(false);
  const { toast } = useToast();

  // Sélectionner automatiquement la première boutique
  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]);
    }
  }, [stores, selectedStore]);

  // Charger les données de livraison
  useEffect(() => {
    if (selectedStore) {
      loadShippingData();
    }
  }, [selectedStore]);

  const loadShippingData = async () => {
    if (!selectedStore) return;

    setIsLoading(true);
    try {
      // Charger les zones
      const { data: zones } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('store_id', selectedStore.id);

      // Charger les méthodes
      const { data: methods } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('store_id', selectedStore.id);

      setShippingZones(zones || []);
      setShippingMethods(methods || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreCreated = (newStore: any) => {
    setSelectedStore(newStore);
    setShowCreateStore(false);
  };

  if (isLoadingStores) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec info boutique */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Truck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gestion des Livraisons</h1>
                {selectedStore && (
                  <p className="text-blue-100">
                    Boutique: <span className="font-semibold">{selectedStore.name}</span>
                  </p>
                )}
              </div>
            </div>
            {stores && stores.length > 1 && (
              <select
                value={selectedStore?.id || ''}
                onChange={(e) => {
                  const store = stores.find(s => s.id === e.target.value);
                  setSelectedStore(store);
                }}
                className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id} className="text-gray-900">
                    {store.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        {!stores || stores.length === 0 ? (
          <NoStoreSelected
            onCreateStore={() => setShowCreateStore(true)}
            showCreateDialog={showCreateStore}
            onStoreCreated={handleStoreCreated}
          />
        ) : selectedStore ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={activeTab === 'zones' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('zones')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Zones de livraison ({shippingZones.length})
                  </Button>
                  <Button
                    variant={activeTab === 'methods' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('methods')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Méthodes de livraison ({shippingMethods.length})
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-2">
              {activeTab === 'zones' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Zones de livraison
                      </CardTitle>
                      <Button onClick={() => setShowCreateZone(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle zone
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : shippingZones.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune zone de livraison</h3>
                        <p className="text-gray-600 mb-4">Créez votre première zone de livraison pour commencer.</p>
                        <Button onClick={() => setShowCreateZone(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une zone
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {shippingZones.map((zone) => (
                          <div key={zone.id} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{zone.name}</h4>
                                <p className="text-sm text-gray-600">{zone.countries?.join(', ')}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'methods' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Méthodes de livraison
                      </CardTitle>
                      <Button onClick={() => setShowCreateMethod(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle méthode
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : shippingMethods.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune méthode de livraison</h3>
                        <p className="text-gray-600 mb-4">Créez votre première méthode de livraison.</p>
                        <Button onClick={() => setShowCreateMethod(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une méthode
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {shippingMethods.map((method) => (
                          <div key={method.id} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{method.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    {method.price}€
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {method.delivery_time}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune boutique sélectionnée</h3>
            <p className="text-gray-600">Sélectionnez une boutique pour gérer ses livraisons.</p>
          </div>
        )}

        {/* Dialogs */}
        <CreateStoreDialog
          open={showCreateStore}
          onOpenChange={setShowCreateStore}
          onStoreCreated={handleStoreCreated}
        />

        {selectedStore && (
          <>
            <CreateZoneDialog
              open={showCreateZone}
              onOpenChange={setShowCreateZone}
              storeId={selectedStore.id}
              onZoneCreated={loadShippingData}
            />

            <CreateMethodDialog
              open={showCreateMethod}
              onOpenChange={setShowCreateMethod}
              storeId={selectedStore.id}
              onMethodCreated={loadShippingData}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Shipping;
