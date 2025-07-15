import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, ArrowLeft, Home } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import BlockRenderer from '@/components/site-builder/BlockRenderer';
import CartWidget from '@/components/site-builder/blocks/CartWidget';
import { Template } from '@/types/template';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type StoreType = Tables<'stores'>;
type ProductType = Tables<'products'>;

const Storefront = () => {
  const { storeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setStoreId } = useCart();

  console.log('Storefront: Loading store:', storeSlug);

  // Fonction pour récupérer les données de la boutique publique
  const fetchStoreData = async () => {
    if (!storeSlug) {
      setError('Slug de boutique manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Recherche de la boutique:', storeSlug);

      // Utiliser la fonction domain-router pour récupérer les données de la boutique
      // Simuler un hostname basé sur le slug pour utiliser la même logique
      const hostname = `${storeSlug}.localhost`;

      const { data, error: routerError } = await supabase.functions.invoke('domain-router', {
        body: { hostname },
      });

      if (routerError) {
        console.error('Erreur domain-router:', routerError);
        // Fallback: recherche directe dans la base de données
        await fetchStoreDataFallback();
        return;
      }

      if (data.error || data.isMainDomain) {
        console.log('Domain-router ne trouve pas la boutique, fallback...');
        await fetchStoreDataFallback();
        return;
      }

      // Succès avec domain-router
      console.log('✅ Boutique trouvée via domain-router:', data);
      setStore(data.store);
      setProducts(data.products || []);
      if (data.siteTemplate) {
        setTemplate(data.siteTemplate);
      }
      setStoreId(data.store.id);
      setLoading(false);

    } catch (err) {
      console.error('Erreur domain-router, fallback...', err);
      await fetchStoreDataFallback();
    }
  };

  // Fallback: recherche directe dans la base de données
  const fetchStoreDataFallback = async () => {
    try {
      console.log('🔄 Fallback: recherche directe en base');

      // 1. Récupérer toutes les boutiques actives et trouver celle qui correspond au slug
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'active');

      if (storesError) throw storesError;

      console.log('Boutiques trouvées:', storesData?.length || 0);

      // Trouver la boutique qui correspond au slug
      const foundStore = storesData?.find(s => {
        const generatedSlug = s.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        console.log(`Boutique "${s.name}" -> slug: "${generatedSlug}"`);
        return generatedSlug === storeSlug;
      });

      if (!foundStore) {
        setError(`Boutique "${storeSlug}" non trouvée ou non active`);
        setLoading(false);
        return;
      }

      console.log('✅ Boutique trouvée:', foundStore.name);
      setStore(foundStore);
      setStoreId(foundStore.id);

      // 2. Récupérer le template publié
      const { data: templateData, error: templateError } = await supabase
        .from('site_templates')
        .select('template_data')
        .eq('store_id', foundStore.id)
        .eq('is_published', true)
        .maybeSingle();

      if (templateError && templateError.code !== 'PGRST116') {
        console.error('Erreur template:', templateError);
      }

      if (templateData) {
        console.log('✅ Template trouvé');
        setTemplate(templateData.template_data as Template);
      } else {
        console.log('⚠️ Aucun template publié trouvé');
      }

      // 3. Récupérer les produits
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('store_id', foundStore.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Erreur produits:', productsError);
      } else {
        console.log('✅ Produits trouvés:', productsData?.length || 0);
        setProducts(productsData || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur fallback:', err);
      setError('Erreur lors du chargement de la boutique');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [storeSlug]);

  // Gérer les paramètres d'URL pour la navigation
  useEffect(() => {
    const page = searchParams.get('page') || 'home';
    const productId = searchParams.get('product');

    setCurrentPage(page);
    setSelectedProductId(productId);
  }, [searchParams]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    // Mettre à jour l'URL sans recharger la page
    window.history.pushState({}, '', `?page=product-detail&product=${productId}`);
  };

  const handlePageNavigation = (page: string) => {
    setCurrentPage(page);
    setSelectedProductId(null);
    window.history.pushState({}, '', page === 'home' ? '' : `?page=${page}`);
  };

  const handleCartNavigation = () => {
    setCurrentPage('cart');
    setSelectedProductId(null);
    window.history.pushState({}, '', '?page=cart');
  };

  const getPageBlocks = (pageName: string) => {
    if (!template) return [];
    return template.pages[pageName] ? template.pages[pageName].sort((a, b) => a.order - b.order) : [];
  };

  const renderNavigation = () => {
    if (!template) return null;

    const mainPages = ['home', 'product', 'category', 'contact'];

    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Nom de la boutique */}
            <div className="flex items-center space-x-3">
              {store?.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="p-2 rounded-lg" style={{ backgroundColor: template.styles.primaryColor }}>
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold">{store?.name}</span>
            </div>

            {/* Navigation principale */}
            <div className="hidden md:flex items-center space-x-8">
              {mainPages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageNavigation(page)}
                  className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                    currentPage === page ? 'border-b-2 pb-1' : ''
                  }`}
                  style={{
                    borderColor: currentPage === page ? template.styles.primaryColor : 'transparent'
                  }}
                >
                  {page === 'home' ? 'Accueil' :
                   page === 'product' ? 'Boutique' :
                   page === 'category' ? 'Catégories' : 'Contact'}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCartNavigation}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderBreadcrumb = () => {
    if (currentPage === 'home') return null;

    return (
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => handlePageNavigation('home')}
              className="hover:text-gray-900 flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
              Accueil
            </button>
            <span>/</span>
            {currentPage === 'product-detail' && selectedProductId ? (
              <>
                <button
                  onClick={() => handlePageNavigation('product')}
                  className="hover:text-gray-900"
                >
                  Boutique
                </button>
                <span>/</span>
                <span className="text-gray-900 font-medium">Détail du produit</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageNavigation('product')}
                  className="ml-2 h-6 px-2 text-xs"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Retour
                </Button>
              </>
            ) : (
              <span className="text-gray-900 font-medium">
                {currentPage === 'product' ? 'Boutique' :
                 currentPage === 'category' ? 'Catégories' :
                 currentPage === 'contact' ? 'Contact' :
                 currentPage === 'cart' ? 'Panier' : currentPage}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  if (error || !store || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique non trouvée</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Cette boutique n\'existe pas ou n\'est pas encore publiée.'}
          </p>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const currentPageBlocks = getPageBlocks(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {renderBreadcrumb()}

      {/* Contenu principal */}
      <div className="min-h-screen">
        {currentPageBlocks.map((block) => (
          <BlockRenderer
            key={`${block.id}-${block.order}`}
            block={block}
            isEditing={false}
            viewMode="desktop"
            selectedStore={store}
            productId={selectedProductId}
            onProductClick={handleProductClick}
          />
        ))}
      </div>

      <CartWidget />
    </div>
  );
};

export default Storefront;
