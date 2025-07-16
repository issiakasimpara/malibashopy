import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Globe,
  Truck,
  Plus,
  Settings,
  MapPin,
  Package,
  RefreshCw,
  Save
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';
import { AFRICAN_FRANCOPHONE_COUNTRIES } from '@/constants/africanCountries';

// Composant pour la configuration des marchés
const MarketConfiguration = ({
  marketSettings,
  onUpdateSettings,
  isLoading
}: {
  marketSettings: any;
  onUpdateSettings: (data: any) => void;
  isLoading: boolean;
}) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    marketSettings?.enabled_countries || []
  );

  // Mettre à jour les pays sélectionnés quand les données changent
  useEffect(() => {
    if (marketSettings?.enabled_countries) {
      setSelectedCountries(marketSettings.enabled_countries);
    }
  }, [marketSettings]);

  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries(prev =>
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleSelectAll = () => {
    setSelectedCountries(AFRICAN_FRANCOPHONE_COUNTRIES.map(country => country.code));
  };

  const handleDeselectAll = () => {
    setSelectedCountries([]);
  };

  const getCountryByCode = (code: string) => {
    return AFRICAN_FRANCOPHONE_COUNTRIES.find(country => country.code === code);
  };

  return (
    <div className="space-y-6">
      {/* Sélection des pays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Pays de vente
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Tout sélectionner
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Tout désélectionner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AFRICAN_FRANCOPHONE_COUNTRIES.map((country) => (
              <div
                key={country.code}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Checkbox
                  id={country.code}
                  checked={selectedCountries.includes(country.code)}
                  onCheckedChange={() => handleCountryToggle(country.code)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={country.code}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium">{country.name}</p>
                      <p className="text-sm text-gray-500">
                        {country.currencySymbol} ({country.currency})
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {selectedCountries.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Pays sélectionnés ({selectedCountries.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map(code => {
                  const country = getCountryByCode(code);
                  return country ? (
                    <Badge key={code} variant="secondary" className="flex items-center gap-1">
                      <span>{country.flag}</span>
                      {country.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          disabled={selectedCountries.length === 0 || isLoading}
          onClick={() => onUpdateSettings({ enabled_countries: selectedCountries })}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </Button>
      </div>
    </div>
  );
};

// Composant pour les méthodes de livraison
const ShippingMethods = ({
  methods,
  onToggleMethod,
  isLoading
}: {
  methods: any[];
  onToggleMethod: (id: string, isActive: boolean) => void;
  isLoading: boolean;
}) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const toggleMethodStatus = (id: string) => {
    const method = methods.find(m => m.id === id);
    if (method) {
      onToggleMethod(id, !method.is_active);
    }
  };

  if (methods.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
        <CardContent className="text-center py-16">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit mx-auto mb-6">
            <Package className="h-12 w-12 mx-auto text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Aucune méthode de livraison
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-md mx-auto">
            Commencez par créer votre première méthode de livraison pour permettre à vos clients de recevoir leurs commandes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <Card
          key={method.id}
          className={`transition-all duration-200 ${
            method.isActive
              ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Icône */}
                <div className="text-3xl">{method.icon}</div>

                {/* Informations principales */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {method.name}
                    </h3>
                    <Badge
                      variant={method.isActive ? "default" : "secondary"}
                      className={method.isActive ? "bg-green-500" : ""}
                    >
                      {method.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {method.price === 0 ? 'Gratuit' : formatCurrency(method.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{method.estimatedDays}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMethodStatus(method.id)}
                  className={method.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                >
                  {method.isActive ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Modal pour créer une nouvelle méthode de livraison
const CreateShippingMethodModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: any) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    estimatedDays: '',
    icon: '📦'
  });

  const SHIPPING_ICONS = [
    { icon: '📦', label: 'Colis standard' },
    { icon: '⚡', label: 'Express' },
    { icon: '🚚', label: 'Camion' },
    { icon: '🏪', label: 'Magasin' },
    { icon: '✈️', label: 'Avion' },
    { icon: '🚲', label: 'Vélo' },
    { icon: '🏃', label: 'Coursier' },
    { icon: '📮', label: 'Poste' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMethod = {
      id: Date.now().toString(),
      ...formData,
      isActive: true
    };

    onSave(newMethod);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      estimatedDays: '',
      icon: '📦'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Créer une méthode de livraison
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la méthode *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Livraison express"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDays">Délai de livraison *</Label>
              <Input
                id="estimatedDays"
                value={formData.estimatedDays}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: e.target.value }))}
                placeholder="Ex: 2-3 jours"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez cette méthode de livraison..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (CFA) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="grid grid-cols-4 gap-2">
                {SHIPPING_ICONS.map(({ icon, label }) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`p-2 text-2xl border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    title={label}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!formData.name || !formData.estimatedDays}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Créer la méthode
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MarketsShipping = () => {
  const { store } = useStores();

  // Données temporaires pour tester
  const marketSettings = null;
  const shippingMethods: any[] = [];
  const enabledCountriesCount = 0;
  const activeShippingMethodsCount = 0;
  const isLoading = false;

  const [activeTab, setActiveTab] = useState('markets');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleAddShippingMethod = (newMethod: any) => {
    console.log('Add shipping method:', newMethod);
  };

  const handleUpdateMarketSettings = (data: any) => {
    console.log('Update market settings:', data);
  };

  const handleToggleShippingMethod = (id: string, isActive: boolean) => {
    console.log('Toggle shipping method:', id, isActive);
  };

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
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Initialiser les paramètres
          </Button>
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

                <MarketConfiguration
                  marketSettings={marketSettings}
                  onUpdateSettings={handleUpdateMarketSettings}
                  isLoading={isLoading}
                />
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

                <ShippingMethods
                  methods={shippingMethods}
                  onToggleMethod={handleToggleShippingMethod}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Shipping Method Modal */}
        <CreateShippingMethodModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleAddShippingMethod}
        />
      </div>
    </DashboardLayout>
  );
};

export default MarketsShipping;
