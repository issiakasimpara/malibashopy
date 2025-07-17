import React, { useEffect, useState, memo, useMemo, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, ArrowLeft, Home, Loader2, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import BlockRenderer from '@/components/site-builder/BlockRenderer';
import CartWidget from '@/components/site-builder/blocks/CartWidget';
import { Template } from '@/types/template';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import type { Tables } from '@/integrations/supabase/types';

// Composant de chargement sophistiqué
const StorefrontLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center animate-fade-in-up">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
        <div className="relative p-4 bg-white rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement de votre boutique</h2>
      <p className="text-gray-600">Préparation de l'expérience shopping...</p>
      <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-shimmer"></div>
      </div>
    </div>
  </div>
));

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      const { data, error: routerError } = await supabase.functions.invoke(`domain-router?hostname=${encodeURIComponent(hostname)}`, {
        method: 'GET',
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

    console.log('Storefront: URL params changed', { page, productId });

    // Vérifier que le produit existe si on est sur la page produit-detail
    if (page === 'product-detail' && productId && products.length > 0) {
      const productExists = products.find(p => p.id === productId);
      if (!productExists) {
        console.log('Storefront: Product not found, redirecting to boutique');
        navigate('?page=product', { replace: true });
        return;
      }
    }

    setCurrentPage(page);
    setSelectedProductId(productId);
  }, [searchParams, products, navigate]);

  // Écouter les changements d'historique (bouton retour du navigateur)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('Storefront: Browser back/forward detected');
      // Forcer la re-lecture des paramètres URL
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page') || 'home';
      const productId = urlParams.get('product');

      console.log('Storefront: Restoring state from URL', { page, productId });

      setCurrentPage(page);
      setSelectedProductId(productId);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleProductClick = (productId: string) => {
    console.log('Storefront: Product clicked', productId);
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    // Utiliser navigate pour une meilleure synchronisation avec React Router
    navigate(`?page=product-detail&product=${productId}`, { replace: false });
  };

  const handlePageNavigation = (page: string) => {
    console.log('Storefront: Page navigation', page);
    setCurrentPage(page);
    setSelectedProductId(null);
    navigate(page === 'home' ? '' : `?page=${page}`, { replace: false });
  };

  const handleCartNavigation = () => {
    console.log('Storefront: Cart navigation');
    setCurrentPage('cart');
    setSelectedProductId(null);
    navigate('?page=cart', { replace: false });
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

              {/* Menu hamburger mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Menu mobile déroulant */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-4 py-2 space-y-1">
                {mainPages.map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      handlePageNavigation(page);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentPage === page
                        ? 'text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: currentPage === page ? template.styles.primaryColor : 'transparent'
                    }}
                  >
                    {page === 'home' ? 'Accueil' :
                     page === 'product' ? 'Boutique' :
                     page === 'category' ? 'Catégories' : 'Contact'}
                  </button>
                ))}
              </div>
            </div>
          )}
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
    return <StorefrontLoader />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {renderNavigation()}
      {renderBreadcrumb()}

      {/* Contenu principal avec animations */}
      <Suspense fallback={<StorefrontLoader />}>
        <div className="min-h-screen animate-fade-in-up">
          {currentPageBlocks.map((block, index) => (
            <div
              key={`${block.id}-${block.order}`}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlockRenderer
                block={block}
                isEditing={false}
                viewMode="desktop"
                selectedStore={store}
                productId={selectedProductId}
                onProductClick={handleProductClick}
              />
            </div>
          ))}
        </div>
      </Suspense>

      <CartWidget />
    </div>
  );
};

export default Storefront;
