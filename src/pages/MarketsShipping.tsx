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
  Save,
  Clock,
  DollarSign,
  Loader2,
  Edit,
  Trash2,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';
import { AFRICAN_FRANCOPHONE_COUNTRIES } from '@/constants/africanCountries';
import { checkDatabaseStatus, createTestData } from '@/utils/createTablesManually';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrer les pays selon le terme de recherche
  const filteredCountries = AFRICAN_FRANCOPHONE_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* En-tête avec barre de recherche */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Sélection des marchés
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choisissez les pays d'Afrique francophone où vous souhaitez vendre vos produits
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs font-medium"
            >
              Tout sélectionner
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="text-xs font-medium"
            >
              Tout désélectionner
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Grille des pays avec design moderne */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCountries.map((country) => {
            const isSelected = selectedCountries.includes(country.code);
            return (
              <div
                key={country.code}
                onClick={() => handleCountryToggle(country.code)}
                className={`
                  group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                  ${isSelected
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                  }
                `}
              >
                {/* Indicateur de sélection */}
                <div className={`
                  absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${isSelected
                    ? 'border-blue-500 bg-blue-500 scale-110'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                  }
                `}>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Contenu du pays */}
                <div className="space-y-3">
                  <div className="text-3xl">{country.flag}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                      {country.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                        {country.code}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {country.currencySymbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Effet de survol */}
                <div className={`
                  absolute inset-0 rounded-2xl transition-opacity duration-200
                  ${isSelected
                    ? 'bg-blue-500/5'
                    : 'bg-blue-500/0 group-hover:bg-blue-500/5'
                  }
                `} />
              </div>
            );
          })}
        </div>

        {/* Message si aucun résultat */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Aucun pays trouvé
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Essayez avec un autre terme de recherche
            </p>
          </div>
        )}
      </div>

      {/* Résumé de la sélection */}
      {selectedCountries.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    {selectedCountries.length} marché{selectedCountries.length > 1 ? 's' : ''} sélectionné{selectedCountries.length > 1 ? 's' : ''}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCountries.slice(0, 8).map(code => {
                    const country = getCountryByCode(code);
                    return country ? (
                      <Badge
                        key={code}
                        variant="secondary"
                        className="bg-white/90 dark:bg-gray-800/90 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                      >
                        <span className="mr-1.5">{country.flag}</span>
                        {country.name}
                      </Badge>
                    ) : null;
                  })}
                  {selectedCountries.length > 8 && (
                    <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 border border-blue-200 dark:border-blue-700">
                      +{selectedCountries.length - 8} autres
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                disabled={isLoading}
                onClick={() => onUpdateSettings({
                  enabledCountries: selectedCountries,
                  defaultCurrency: 'XOF',
                  taxSettings: {
                    includeTax: false,
                    taxRate: 0,
                    taxLabel: 'TVA'
                  }
                })}
                className="ml-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun pays sélectionné */}
      {selectedCountries.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-fit mx-auto mb-6">
              <Globe className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg">
              Aucun marché sélectionné
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Sélectionnez au moins un pays pour commencer à vendre vos produits dans les marchés d'Afrique francophone
            </p>
          </CardContent>
        </Card>
      )}
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
            method.is_active
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

                  {/* Pays disponibles */}
                  {method.availableCountries && method.availableCountries.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Disponible dans {method.availableCountries.length} pays :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {method.availableCountries.slice(0, 5).map((countryCode: string) => {
                          const country = AFRICAN_FRANCOPHONE_COUNTRIES.find(c => c.code === countryCode);
                          return country ? (
                            <Badge key={countryCode} variant="outline" className="text-xs px-1.5 py-0.5">
                              {country.flag} {country.name}
                            </Badge>
                          ) : null;
                        })}
                        {method.availableCountries.length > 5 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            +{method.availableCountries.length - 5} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
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
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMethodStatus(method.id)}
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
                  Supprimer
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
const CreateShippingMethodModal = ({
  isOpen,
  onClose,
  onSave,
  editingMethod = null,
  availableCountries = []
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: any) => void;
  editingMethod?: any;
  availableCountries?: string[];
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    estimatedDays: '',
    icon: '📦',
    availableCountries: [] as string[]
  });

  useEffect(() => {
    if (editingMethod) {
      setFormData({
        name: editingMethod.name || '',
        description: editingMethod.description || '',
        price: editingMethod.price || 0,
        estimatedDays: editingMethod.estimated_days || '',
        icon: editingMethod.icon || '📦',
        availableCountries: editingMethod.availableCountries || availableCountries
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        estimatedDays: '',
        icon: '📦',
        availableCountries: availableCountries
      });
    }
  }, [editingMethod, isOpen, availableCountries]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const methodData = {
      ...formData,
      is_active: true
    };

    try {
      await onSave(methodData);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      estimatedDays: '',
      icon: '📦',
      availableCountries: []
    });
    onClose();
  };

  const handleCountryToggle = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      availableCountries: prev.availableCountries.includes(countryCode)
        ? prev.availableCountries.filter(code => code !== countryCode)
        : [...prev.availableCountries, countryCode]
    }));
  };

  const getCountryByCode = (code: string) => {
    return AFRICAN_FRANCOPHONE_COUNTRIES.find(country => country.code === code);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {editingMethod ? 'Modifier la méthode' : 'Créer une méthode de livraison'}
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

          {/* Sélection des pays disponibles */}
          {availableCountries.length > 0 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Pays de livraison disponibles</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sélectionnez les pays où cette méthode de livraison sera disponible
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
                {availableCountries.map((countryCode) => {
                  const country = getCountryByCode(countryCode);
                  if (!country) return null;

                  return (
                    <div key={countryCode} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${countryCode}`}
                        checked={formData.availableCountries.includes(countryCode)}
                        onCheckedChange={() => handleCountryToggle(countryCode)}
                      />
                      <label
                        htmlFor={`country-${countryCode}`}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              {formData.availableCountries.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.availableCountries.map(code => {
                    const country = getCountryByCode(code);
                    return country ? (
                      <Badge key={code} variant="secondary" className="text-xs">
                        {country.flag} {country.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!formData.name || !formData.estimatedDays || (availableCountries.length > 0 && formData.availableCountries.length === 0)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {editingMethod ? 'Modifier' : 'Créer la méthode'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MarketsShipping = () => {
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
    initializeDefaultSettings,
  } = useMarketsShipping(store?.id);

  const [activeTab, setActiveTab] = useState('markets');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [isSettingUpDB, setIsSettingUpDB] = useState(false);

  const handleCreateMethod = async (methodData: any) => {
    if (!store?.id) return;

    try {
      await createShippingMethod({ storeId: store.id, methodData });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleEditMethod = (method: any) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleUpdateMethod = async (methodData: any) => {
    if (editingMethod) {
      try {
        await updateShippingMethod({ methodId: editingMethod.id, methodData });
        setEditingMethod(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Erreur lors de la modification:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  const handleSetupDatabase = async () => {
    setIsSettingUpDB(true);
    try {
      // Vérifier d'abord l'état de la DB
      const status = await checkDatabaseStatus();
      console.log('État DB:', status);

      if (!status.marketSettings || !status.shippingMethods) {
        // Créer des données de test
        const success = await createTestData();
        if (success) {
          // Recharger les données après la création
          window.location.reload();
        }
      } else {
        alert('Les tables existent déjà !');
      }
    } catch (error) {
      console.error('Erreur setup DB:', error);
      alert('Erreur lors de la configuration. Consultez la console.');
    } finally {
      setIsSettingUpDB(false);
    }
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
          <div className="flex gap-2">
            {!marketSettings && (
              <Button
                onClick={() => store?.id && initializeDefaultSettings(store.id)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Initialiser les paramètres
              </Button>
            )}
          </div>
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
                  onUpdateSettings={(settings) => store?.id && updateMarketSettings({ storeId: store.id, settings })}
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
                  onToggleMethod={(methodId, isActive) => toggleShippingMethod({ methodId, isActive })}
                  onEditMethod={handleEditMethod}
                  onDeleteMethod={(methodId) => deleteShippingMethod(methodId)}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Shipping Method Modal */}
        <CreateShippingMethodModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingMethod ? handleUpdateMethod : handleCreateMethod}
          editingMethod={editingMethod}
          availableCountries={marketSettings?.enabled_countries || []}
        />
      </div>
    </DashboardLayout>
  );
};

export default MarketsShipping;
