import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Truck,
  Settings,
  MapPin,
  Package
} from 'lucide-react';

const MarketsShipping = () => {
  const [activeTab, setActiveTab] = useState('markets');

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
                    0
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
                    0
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
                    0%
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
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl w-fit mx-auto mb-6">
                <Package className="h-12 w-12 mx-auto text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Marchés et Livraisons
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-md mx-auto">
                Cette fonctionnalité sera bientôt disponible. Vous pourrez configurer vos marchés de vente et méthodes de livraison.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarketsShipping;
