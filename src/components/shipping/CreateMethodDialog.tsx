import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  onMethodCreated: () => void;
}

const CreateMethodDialog = ({ open, onOpenChange, storeId, onMethodCreated }: CreateMethodDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [zones, setZones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadZones();
    }
  }, [open, storeId]);

  const loadZones = async () => {
    try {
      const { data } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('store_id', storeId);
      
      setZones(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !price || !deliveryTime || !zoneId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('shipping_methods')
        .insert({
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          delivery_time: deliveryTime,
          zone_id: zoneId,
          store_id: storeId,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Méthode de livraison créée avec succès"
      });

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      setZoneId('');
      
      onMethodCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la méthode",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer une méthode de livraison</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la méthode *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Livraison Express"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la méthode de livraison"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="deliveryTime">Délai de livraison *</Label>
              <Input
                id="deliveryTime"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="Ex: 2-3 jours"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="zone">Zone de livraison *</Label>
            {zones.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Aucune zone de livraison trouvée. Créez d'abord une zone de livraison.
                </p>
              </div>
            ) : (
              <Select value={zoneId} onValueChange={setZoneId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name} ({zone.countries?.length || 0} pays)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || zones.length === 0}
            >
              {isLoading ? 'Création...' : 'Créer la méthode'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMethodDialog;
