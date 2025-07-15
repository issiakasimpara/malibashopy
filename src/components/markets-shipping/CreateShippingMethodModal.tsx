import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Package, DollarSign, Clock, Settings } from 'lucide-react';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';
import { CreateShippingMethodData } from '@/types/marketsShipping';

interface CreateShippingMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId?: string;
}

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

const CreateShippingMethodModal: React.FC<CreateShippingMethodModalProps> = ({
  isOpen,
  onClose,
  storeId
}) => {
  const { createShippingMethod, isCreatingShippingMethod } = useMarketsShipping(storeId);

  const [formData, setFormData] = useState<CreateShippingMethodData>({
    name: '',
    description: '',
    price: 0,
    estimatedDays: '',
    icon: '📦',
    conditions: {
      minOrderAmount: undefined,
      maxOrderAmount: undefined,
      freeShippingThreshold: undefined,
    }
  });

  const [hasConditions, setHasConditions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeId) return;

    const dataToSubmit = {
      ...formData,
      conditions: hasConditions ? formData.conditions : undefined
    };

    createShippingMethod({ storeId, methodData: dataToSubmit });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      estimatedDays: '',
      icon: '📦',
      conditions: {
        minOrderAmount: undefined,
        maxOrderAmount: undefined,
        freeShippingThreshold: undefined,
      }
    });
    setHasConditions(false);
    onClose();
  };

  const updateCondition = (field: keyof NonNullable<CreateShippingMethodData['conditions']>, value: number | undefined) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
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
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Conditions avancées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Conditions avancées
                </span>
                <Switch
                  checked={hasConditions}
                  onCheckedChange={setHasConditions}
                />
              </CardTitle>
            </CardHeader>
            {hasConditions && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Commande minimum (CFA)</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      min="0"
                      value={formData.conditions?.minOrderAmount || ''}
                      onChange={(e) => updateCondition('minOrderAmount', parseFloat(e.target.value) || undefined)}
                      placeholder="Optionnel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxOrder">Commande maximum (CFA)</Label>
                    <Input
                      id="maxOrder"
                      type="number"
                      min="0"
                      value={formData.conditions?.maxOrderAmount || ''}
                      onChange={(e) => updateCondition('maxOrderAmount', parseFloat(e.target.value) || undefined)}
                      placeholder="Optionnel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeShipping">Livraison gratuite à partir de (CFA)</Label>
                    <Input
                      id="freeShipping"
                      type="number"
                      min="0"
                      value={formData.conditions?.freeShippingThreshold || ''}
                      onChange={(e) => updateCondition('freeShippingThreshold', parseFloat(e.target.value) || undefined)}
                      placeholder="Optionnel"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isCreatingShippingMethod || !formData.name || !formData.estimatedDays}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isCreatingShippingMethod ? 'Création...' : 'Créer la méthode'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingMethodModal;
