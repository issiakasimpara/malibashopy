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
