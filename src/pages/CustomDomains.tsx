import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CustomDomainManager from '@/components/domains/CustomDomainManager';
import { useStores } from '@/hooks/useStores';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, AlertCircle } from 'lucide-react';

const CustomDomains = () => {
  const { store, isLoading } = useStores();
  const { loading: authLoading } = useAuth();

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Chargement...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!store) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Aucune boutique trouvée</h2>
              <p className="text-muted-foreground">
                Vous devez d'abord créer une boutique pour configurer vos domaines personnalisés.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Domaines personnalisés</h1>
            <p className="text-muted-foreground">
              Gérez les domaines personnalisés pour votre boutique <strong>{store.name}</strong>
            </p>
          </div>
        </div>
        
        <CustomDomainManager 
          storeId={store.id} 
          storeName={store.name}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomDomains;