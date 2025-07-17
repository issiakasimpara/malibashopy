// ========================================
// DIALOGUE DE CRÉATION DE MÉTHODE DE LIVRAISON
// ========================================

import { useState } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { Market } from '@/types/markets';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Loader2 } from 'lucide-react';

interface CreateShippingMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  markets: Market[];
  editingMethod?: any; // Méthode à éditer (optionnel)
  onSuccess?: () => void;
}

const CreateShippingMethodDialog = ({
  open,
  onOpenChange,
  storeId,
  markets,
  editingMethod,
  onSuccess
}: CreateShippingMethodDialogProps) => {
  const { createShippingMethod, updateShippingMethod, isCreatingMethod, isUpdatingMethod } = useMarkets(storeId);
  const [formData, setFormData] = useState({
    name: editingMethod?.name || '',
    description: editingMethod?.description || '',
    market_id: editingMethod?.market_id || '',
    price: editingMethod?.price?.toString() || '',
    estimated_min_days: editingMethod?.estimated_min_days?.toString() || '',
    estimated_max_days: editingMethod?.estimated_max_days?.toString() || '',
    is_active: editingMethod?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.market_id || !formData.price) {
      return;
    }

    const price = parseFloat(formData.price);
    const minDays = parseInt(formData.estimated_min_days) || 1;
    const maxDays = parseInt(formData.estimated_max_days) || minDays;

    if (isNaN(price) || price < 0) {
      return;
    }

    if (maxDays < minDays) {
      return;
    }

    try {
      if (editingMethod) {
        // Mode édition
        await updateShippingMethod({
          id: editingMethod.id,
          updates: {
            market_id: formData.market_id,
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            price: price,
            estimated_min_days: minDays,
            estimated_max_days: maxDays,
            is_active: formData.is_active
          }
        });
      } else {
        // Mode création
        await createShippingMethod({
          store_id: storeId,
          market_id: formData.market_id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: price,
          estimated_min_days: minDays,
          estimated_max_days: maxDays,
          is_active: formData.is_active
        });
      }

      // Reset form
      if (!editingMethod) {
        setFormData({
          name: '',
          description: '',
          market_id: '',
          price: '',
          estimated_min_days: '',
          estimated_max_days: '',
          is_active: true
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création de la méthode de livraison:', error);
    }
  };

  const handleClose = () => {
    if (!editingMethod) {
      setFormData({
        name: '',
        description: '',
        market_id: '',
        price: '',
        estimated_min_days: '',
        estimated_max_days: '',
        is_active: true
      });
    }
    onOpenChange(false);
  };

  const activeMarkets = markets.filter(market => market.is_active);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Créer une méthode de livraison
          </DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle option de livraison pour un de vos marchés.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="market">Marché *</Label>
            <Select value={formData.market_id} onValueChange={(value) => setFormData(prev => ({ ...prev, market_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un marché" />
              </SelectTrigger>
              <SelectContent>
                {activeMarkets.map((market) => (
                  <SelectItem key={market.id} value={market.id}>
                    {market.name} ({market.countries.length} pays)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la méthode *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Livraison standard, Express..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de cette méthode de livraison..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix (CFA) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_days">Délai min (jours)</Label>
              <Input
                id="min_days"
                type="number"
                min="1"
                value={formData.estimated_min_days}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_min_days: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_days">Délai max (jours)</Label>
              <Input
                id="max_days"
                type="number"
                min="1"
                value={formData.estimated_max_days}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_max_days: e.target.value }))}
                placeholder="7"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
            />
            <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
              Méthode active (disponible pour les clients)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isCreatingMethod || !formData.name.trim() || !formData.market_id || !formData.price}
            >
              {isCreatingMethod && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer la méthode
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShippingMethodDialog;
