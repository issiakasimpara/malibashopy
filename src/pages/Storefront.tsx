import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import BlockRenderer from '@/components/site-builder/BlockRenderer';
import CartWidget from '@/components/site-builder/blocks/CartWidget';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react';

const Storefront = () => {
  const { storeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { stores } = useStores();
  const { templates } = useSiteTemplates();
  const { products } = useProducts();
  const { setStoreId } = useCart();

  // Trouver le store par slug
  const store = stores.find(s => 
    s.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === storeSlug
  );

  useEffect(() => {
    if (store) {
      console.log('Storefront: Setting store ID:', store.id);
      setStoreId(store.id);
      
      // Charger le template du store
      const storeTemplate = templates.find(t => t.storeId === store.id);
      if (storeTemplate) {
        setTemplate(storeTemplate);
      }
      setLoading(false);
    } else if (stores.length > 0) {
      setError('Boutique non trouvée');
      setLoading(false);
    }
  }, [store, stores, templates, setStoreId]);

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
              <div className="p-2 rounded-lg" style={{ backgroundColor: template.styles.primaryColor }}>
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
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
          <Button onClick={() => window.location.href = '/'}>
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
