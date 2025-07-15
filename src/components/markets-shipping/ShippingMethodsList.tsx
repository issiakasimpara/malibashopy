import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Edit, 
  Trash2, 
  Clock, 
  DollarSign,
  Package,
  AlertCircle
} from 'lucide-react';
import { StoreShippingMethod } from '@/types/marketsShipping';
import { useMarketsShipping } from '@/hooks/useMarketsShipping';
import { formatCurrency } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ShippingMethodsListProps {
  shippingMethods: StoreShippingMethod[];
  storeId?: string;
}

const ShippingMethodsList: React.FC<ShippingMethodsListProps> = ({
  shippingMethods,
  storeId
}) => {
  const { 
    toggleShippingMethod, 
    deleteShippingMethod,
    isTogglingShippingMethod,
    isDeletingShippingMethod
  } = useMarketsShipping(storeId);

  const [editingMethod, setEditingMethod] = useState<string | null>(null);

  const handleToggleStatus = (methodId: string, isActive: boolean) => {
    toggleShippingMethod({ methodId, isActive });
  };

  const handleDeleteMethod = (methodId: string) => {
    deleteShippingMethod(methodId);
  };

  if (shippingMethods.length === 0) {
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
      {shippingMethods.map((method) => (
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
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        {method.price === 0 ? 'Gratuit' : formatCurrency(method.price, 'CFA')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{method.estimatedDays}</span>
                    </div>
                  </div>

                  {/* Conditions spéciales */}
                  {method.conditions && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Conditions spéciales
                      </h4>
                      <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                        {method.conditions.minOrderAmount && (
                          <p>• Commande minimum : {formatCurrency(method.conditions.minOrderAmount, 'CFA')}</p>
                        )}
                        {method.conditions.maxOrderAmount && (
                          <p>• Commande maximum : {formatCurrency(method.conditions.maxOrderAmount, 'CFA')}</p>
                        )}
                        {method.conditions.freeShippingThreshold && (
                          <p>• Livraison gratuite à partir de : {formatCurrency(method.conditions.freeShippingThreshold, 'CFA')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Switch pour activer/désactiver */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={method.isActive}
                    onCheckedChange={(checked) => handleToggleStatus(method.id, checked)}
                    disabled={isTogglingShippingMethod}
                  />
                  <span className="text-sm text-gray-500">
                    {method.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                {/* Bouton Modifier */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMethod(method.id)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>

                {/* Bouton Supprimer */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Supprimer la méthode de livraison
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer la méthode "{method.name}" ? 
                        Cette action est irréversible et pourrait affecter les commandes en cours.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteMethod(method.id)}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isDeletingShippingMethod}
                      >
                        {isDeletingShippingMethod ? 'Suppression...' : 'Supprimer'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShippingMethodsList;
