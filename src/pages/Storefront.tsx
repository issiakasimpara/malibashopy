import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ShoppingBag, Store } from 'lucide-react';

const Storefront = () => {
  const { storeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log('Storefront: Loading store:', storeSlug);

  // Version simplifiée pour éviter les erreurs
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation simple */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-600">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Boutique: {storeSlug}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/store/${storeSlug}/cart`)}
              >
                <ShoppingBag className="h-5 w-5" />
                Panier
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-3xl font-bold mb-4">Boutique: {storeSlug}</h1>
          <p className="text-gray-600 mb-8">
            Bienvenue dans cette boutique ! Cette page sera bientôt entièrement fonctionnelle.
          </p>

          <div className="grid gap-4 max-w-md mx-auto">
            <Button
              onClick={() => navigate(`/store/${storeSlug}/cart`)}
              className="w-full"
            >
              Voir le panier
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>🚧 En développement :</strong> Cette boutique publique sera bientôt complètement intégrée avec les templates et produits.
            </p>
          </div>
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
