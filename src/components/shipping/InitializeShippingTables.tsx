import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle, AlertCircle, Loader2, TestTube, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { testShippingTables, createSampleShippingData } from '@/utils/testShippingTables';
import { createShippingTablesDirectly, verifyShippingTables } from '@/utils/createTablesDirectly';
import { useStores } from '@/hooks/useStores';

const InitializeShippingTables = () => {
  const { stores } = useStores();
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isCreatingData, setIsCreatingData] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createTablesManually = async () => {
    setIsCreating(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await createShippingTablesDirectly();

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message + (result.instructions || ''));
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création des tables:', error);
      setStatus('error');
      setMessage(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const testTablesExist = async () => {
    setIsTesting(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await verifyShippingTables();

      if (result.success) {
        setStatus('success');
        setMessage(result.message + (result.data ? ` (Zones: ${result.data.zonesCount}, Méthodes: ${result.data.methodsCount})` : ''));
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Impossible de vérifier l\'existence des tables.');
    } finally {
      setIsTesting(false);
    }
  };

  const createTestData = async () => {
    if (!stores || stores.length === 0) {
      setStatus('error');
      setMessage('Aucune boutique trouvée. Créez d\'abord une boutique.');
      return;
    }

    setIsCreatingData(true);
    setStatus('idle');
    setMessage('');

    try {
      const firstStore = stores[0];
      const result = await createSampleShippingData(firstStore.id);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur lors de la création des données de test.');
    } finally {
      setIsCreatingData(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Initialisation des tables de livraisons
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={testTablesExist}
            variant="outline"
            disabled={isCreating || isTesting || isCreatingData}
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Tester les tables
              </>
            )}
          </Button>

          <Button
            onClick={createTablesManually}
            disabled={isCreating || isTesting || isCreatingData}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Créer les tables
              </>
            )}
          </Button>

          <Button
            onClick={createTestData}
            variant="outline"
            disabled={isCreating || isTesting || isCreatingData || !stores?.length}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {isCreatingData ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création données...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Créer données test
              </>
            )}
          </Button>
        </div>

        {status !== 'idle' && (
          <Alert className={status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className="whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Instructions alternatives :</h4>
          <p className="text-sm text-blue-700">
            Si la création automatique ne fonctionne pas, vous pouvez créer les tables manuellement 
            dans Supabase → Table Editor en suivant les instructions qui s'afficheront ci-dessus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitializeShippingTables;
