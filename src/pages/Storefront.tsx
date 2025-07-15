import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, ArrowLeft, Home } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import BlockRenderer from '@/components/site-builder/BlockRenderer';
import CartWidget from '@/components/site-builder/blocks/CartWidget';
import { Template } from '@/types/template';
import type { Tables } from '@/integrations/supabase/types';

type StoreType = Tables<'stores'>;

const Storefront = () => {
  const { storeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { stores } = useStores();
  const { setStoreId } = useCart();

  console.log('Storefront: Loading store:', storeSlug);

  // Trouver le store par slug
  const store = stores.find(s =>
    s.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === storeSlug
  );

  const { templates } = useSiteTemplates(store?.id);
  const { products } = useProducts(store?.id);

  useEffect(() => {
    if (store) {
      console.log('Storefront: Setting store ID:', store.id);
      setStoreId(store.id);

      // Charger le template du store
      const storeTemplate = templates.find(t => t.is_published);
      if (storeTemplate) {
        setTemplate(storeTemplate.template_data);
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
};



export default Storefront;
