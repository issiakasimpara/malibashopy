import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, Globe, DollarSign } from 'lucide-react';
import { AFRICAN_FRANCOPHONE_COUNTRIES } from '@/constants/africanCountries';
import { MarketSettings } from '@/types/marketsShipping';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';

interface MarketSettingsFormProps {
  marketSettings: MarketSettings | null;
  storeId?: string;
}

const MarketSettingsForm: React.FC<MarketSettingsFormProps> = ({
  marketSettings,
  storeId
}) => {
  const { updateMarketSettings, isUpdatingMarketSettings } = useMarketsShipping(storeId);
  
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState('XOF');
  const [includeTax, setIncludeTax] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [taxLabel, setTaxLabel] = useState('TVA');

  useEffect(() => {
    if (marketSettings) {
      setSelectedCountries(marketSettings.enabledCountries || []);
      setDefaultCurrency(marketSettings.defaultCurrency || 'XOF');
      setIncludeTax(marketSettings.taxSettings?.includeTax || false);
      setTaxRate(marketSettings.taxSettings?.taxRate || 0);
      setTaxLabel(marketSettings.taxSettings?.taxLabel || 'TVA');
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

  const handleSave = () => {
    if (!storeId) return;

    updateMarketSettings({
      storeId,
      settings: {
        enabledCountries: selectedCountries,
        defaultCurrency,
        taxSettings: {
          includeTax,
          taxRate,
          taxLabel
        }
      }
    });
  };

  const getCountryByCode = (code: string) => {
    return AFRICAN_FRANCOPHONE_COUNTRIES.find(country => country.code === code);
  };

  const uniqueCurrencies = Array.from(
    new Set(AFRICAN_FRANCOPHONE_COUNTRIES.map(country => country.currency))
  );

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

      {/* Configuration des devises et taxes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuration financière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Devise par défaut */}
          <div className="space-y-2">
            <Label htmlFor="currency">Devise par défaut</Label>
            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une devise" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCurrencies.map(currency => {
                  const country = AFRICAN_FRANCOPHONE_COUNTRIES.find(c => c.currency === currency);
                  return (
                    <SelectItem key={currency} value={currency}>
                      {currency} - {country?.currencySymbol}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Configuration des taxes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="include-tax">Inclure les taxes dans les prix</Label>
                <p className="text-sm text-gray-500">
                  Les prix affichés incluront automatiquement les taxes
                </p>
              </div>
              <Switch
                id="include-tax"
                checked={includeTax}
                onCheckedChange={setIncludeTax}
              />
            </div>

            {includeTax && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Taux de taxe (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-label">Libellé de la taxe</Label>
                  <Input
                    id="tax-label"
                    value={taxLabel}
                    onChange={(e) => setTaxLabel(e.target.value)}
                    placeholder="TVA"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isUpdatingMarketSettings || selectedCountries.length === 0}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isUpdatingMarketSettings ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </Button>
      </div>
    </div>
  );
};

export default MarketSettingsForm;
