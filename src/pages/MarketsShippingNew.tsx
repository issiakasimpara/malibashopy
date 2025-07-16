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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Truck,
  Plus,
  Save,
  MapPin,
  Package,
  Clock,
  DollarSign,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';
import { useToast } from '@/hooks/use-toast';
import { AFRICAN_FRANCOPHONE_COUNTRIES } from '@/constants/africanCountries';

// Interface pour les méthodes de livraison
interface ShippingMethodForm {
  name: string;
  description: string;
  price: number;
  estimated_days: string;
  icon: string;
}

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
            Marchés disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AFRICAN_FRANCOPHONE_COUNTRIES.map((country) => (
              <div
                key={country.code}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Checkbox
                  id={country.code}
                  checked={selectedCountries.includes(country.code)}
                  onCheckedChange={() => handleCountryToggle(country.code)}
                />
                <label
                  htmlFor={country.code}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pays sélectionnés */}
      {selectedCountries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pays sélectionnés ({selectedCountries.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          disabled={selectedCountries.length === 0 || isLoading}
          onClick={() => onUpdateSettings({ enabled_countries: selectedCountries })}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
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
  onEditMethod,
  onDeleteMethod,
  isLoading 
}: {
  methods: any[];
  onToggleMethod: (id: string, isActive: boolean) => void;
  onEditMethod: (method: any) => void;
  onDeleteMethod: (id: string) => void;
  isLoading: boolean;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Aucune méthode de livraison
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Commencez par ajouter votre première méthode de livraison.
            </p>
          </div>
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
            method.is_active
              ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{method.icon}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {method.name}
                    </h3>
                    <Badge
                      variant={method.is_active ? "default" : "secondary"}
                      className={method.is_active ? "bg-green-500" : ""}
                    >
                      {method.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        {method.price === 0 ? 'Gratuit' : formatCurrency(method.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{method.estimated_days}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditMethod(method)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleMethod(method.id, !method.is_active)}
                  className={method.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                >
                  {method.is_active ? 'Désactiver' : 'Activer'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteMethod(method.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Modal pour créer/éditer une méthode de livraison
const ShippingMethodModal = ({
  isOpen,
  onClose,
  onSave,
  editingMethod = null,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: ShippingMethodForm) => void;
  editingMethod?: any;
  isLoading?: boolean;
}) => {
  const [formData, setFormData] = useState<ShippingMethodForm>({
    name: '',
    description: '',
    price: 0,
    estimated_days: '',
    icon: '📦'
  });

  useEffect(() => {
    if (editingMethod) {
      setFormData({
        name: editingMethod.name || '',
        description: editingMethod.description || '',
        price: editingMethod.price || 0,
        estimated_days: editingMethod.estimated_days || '',
        icon: editingMethod.icon || '📦'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        estimated_days: '',
        icon: '📦'
      });
    }
  }, [editingMethod, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const iconOptions = [
    { value: '📦', label: '📦 Standard' },
    { value: '⚡', label: '⚡ Express' },
    { value: '🚚', label: '🚚 Camion' },
    { value: '🏪', label: '🏪 Magasin' },
    { value: '✈️', label: '✈️ Aérien' },
    { value: '🚢', label: '🚢 Maritime' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingMethod ? 'Modifier la méthode' : 'Nouvelle méthode de livraison'}
          </DialogTitle>
          <DialogDescription>
            {editingMethod
              ? 'Modifiez les informations de cette méthode de livraison.'
              : 'Créez une nouvelle méthode de livraison pour votre boutique.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la méthode</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Livraison standard"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icône</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (XOF)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_days">Délai estimé</Label>
              <Input
                id="estimated_days"
                value={formData.estimated_days}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_days: e.target.value }))}
                placeholder="Ex: 2-3 jours"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingMethod ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal
const MarketsShippingNew = () => {
  const { store } = useStores();
  const {
    marketSettings,
    shippingMethods,
    enabledCountriesCount,
    activeShippingMethodsCount,
    isLoading,
    createShippingMethod,
    updateMarketSettings,
    updateShippingMethod,
    deleteShippingMethod,
    toggleShippingMethod,
  } = useMarketsShipping();

  const [activeTab, setActiveTab] = useState('markets');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);

  const handleCreateMethod = (methodData: ShippingMethodForm) => {
    createShippingMethod(methodData);
    setIsModalOpen(false);
  };

  const handleEditMethod = (method: any) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleUpdateMethod = (methodData: ShippingMethodForm) => {
    if (editingMethod) {
      updateShippingMethod(editingMethod.id, methodData);
      setEditingMethod(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Marchés et Livraisons
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configurez vos marchés cibles et méthodes de livraison
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Marchés actifs
                  </p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {enabledCountriesCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    sur {AFRICAN_FRANCOPHONE_COUNTRIES.length} disponibles
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Méthodes actives
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {activeShippingMethodsCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    sur {shippingMethods.length} créées
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Couverture
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {Math.round((enabledCountriesCount / AFRICAN_FRANCOPHONE_COUNTRIES.length) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    des marchés disponibles
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="markets" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Marchés
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
                  onUpdateSettings={updateMarketSettings}
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
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une méthode
                  </Button>
                </div>

                <ShippingMethods
                  methods={shippingMethods}
                  onToggleMethod={toggleShippingMethod}
                  onEditMethod={handleEditMethod}
                  onDeleteMethod={deleteShippingMethod}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modal */}
        <ShippingMethodModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingMethod ? handleUpdateMethod : handleCreateMethod}
          editingMethod={editingMethod}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default MarketsShippingNew;
