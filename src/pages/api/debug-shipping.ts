// API de debug pour les méthodes de livraison
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, storeSlug } = req.body;

    if (action === 'check_methods') {
      // 1. Trouver la boutique par slug
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, name, slug')
        .eq('slug', storeSlug)
        .single();

      if (storeError || !store) {
        return res.status(404).json({ 
          error: 'Boutique non trouvée',
          storeSlug,
          storeError 
        });
      }

      // 2. Récupérer les méthodes de cette boutique
      const { data: methods, error: methodsError } = await supabase
        .from('shipping_methods')
        .select(`
          *,
          shipping_zones(*)
        `)
        .eq('store_id', store.id)
        .eq('is_active', true)
        .order('sort_order');

      // 3. Récupérer toutes les méthodes (pour comparaison)
      const { data: allMethods, error: allError } = await supabase
        .from('shipping_methods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      return res.status(200).json({
        success: true,
        store,
        methods: methods || [],
        methodsError,
        allMethods: allMethods || [],
        debug: {
          storeId: store.id,
          methodsCount: methods?.length || 0,
          totalMethodsInDB: allMethods?.length || 0
        }
      });
    }

    return res.status(400).json({ error: 'Action non reconnue' });

  } catch (error) {
    console.error('Erreur debug shipping:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message 
    });
  }
}
