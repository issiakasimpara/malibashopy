
import { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { useProducts } from '@/hooks/useProducts';
import { useProductVariants } from '@/hooks/useProductVariants';
import { useProductVariantSelection } from '@/hooks/useProductVariantSelection';
import ProductImageGallery from './product-detail/ProductImageGallery';
import ProductDetailLoadingState from './product-detail/ProductDetailLoadingState';
import ProductDetailEmptyState from './product-detail/ProductDetailEmptyState';
import ProductDetailHeader from './product-detail/ProductDetailHeader';
import ProductDetailInfo from './product-detail/ProductDetailInfo';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface ProductDetailBlockProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
  productId?: string | null;
  onProductClick?: (productId: string) => void;
}

const ProductDetailBlock = ({ 
  block, 
  isEditing, 
  viewMode = 'desktop', 
  selectedStore,
  productId,
  onProductClick
}: ProductDetailBlockProps) => {
  const { products, isLoading } = useProducts(selectedStore?.id);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  
  console.log('ProductDetailBlock - Debug info:');
  console.log('- Received productId:', productId);
  console.log('- Products available:', products?.length || 0);
  console.log('- Store ID:', selectedStore?.id);
  console.log('- Is editing mode:', isEditing);

  if (isLoading) {
    console.log('ProductDetailBlock - Loading products...');
    return <ProductDetailLoadingState />;
  }

  // Si un productId spécifique est fourni, le trouver
  let selectedProduct = null;
  if (productId) {
    selectedProduct = products.find(p => p.id === productId);
    console.log('ProductDetailBlock - Looking for specific product:', productId);
    console.log('ProductDetailBlock - Found specific product:', !!selectedProduct);
  }

  // Si aucun produit spécifique trouvé ou pas d'ID fourni, prendre le premier
  if (!selectedProduct && products.length > 0) {
    selectedProduct = products[0];
    console.log('ProductDetailBlock - Using first available product as fallback:', selectedProduct?.id);
  }

  console.log('ProductDetailBlock - Final selected product:', {
    id: selectedProduct?.id,
    name: selectedProduct?.name,
    price: selectedProduct?.price,
    images: selectedProduct?.images?.length || 0
  });

  // Si aucun produit n'est disponible
  if (!selectedProduct) {
    console.log('ProductDetailBlock - No product found');
    return <ProductDetailEmptyState productId={productId} />;
  }

  // Charger les variantes du produit sélectionné
  const { variants } = useProductVariants(selectedProduct.id);
  
  // Gérer la sélection des variantes
  const {
    selectedVariant,
    selectedAttributes,
    selectAttribute,
    getCurrentPrice,
    getCurrentComparePrice,
    getCurrentStock,
    isInStock
  } = useProductVariantSelection({
    product: selectedProduct,
    variants: variants || []
  });

  // Gérer le changement d'image basé sur la variante
  const handleVariantImageChange = (images: string[]) => {
    console.log('ProductDetailBlock - Variant image changed:', images);
    setCurrentImages(images);
  };

  // Déterminer quelles images afficher (variante ou produit par défaut)
  const imagesToDisplay = currentImages.length > 0 ? currentImages : (selectedProduct.images || []);

  const getGridLayout = () => {
    if (viewMode === 'mobile') return 'grid-cols-1';
    return 'grid-cols-1 lg:grid-cols-2';
  };

  const currentPrice = getCurrentPrice();
  const currentComparePrice = getCurrentComparePrice();

  console.log('ProductDetailBlock - Rendering product detail for:', {
    productName: selectedProduct.name,
    currentPrice,
    currentComparePrice,
    inStock: isInStock(),
    imagesCount: imagesToDisplay.length,
    currentImages: imagesToDisplay
  });

  return (
    <div className="bg-white">
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <ProductDetailHeader productName={selectedProduct.name} />

          <div className={`grid ${getGridLayout()} gap-12`}>
            {/* Galerie d'images */}
            <ProductImageGallery
              images={imagesToDisplay}
              productName={selectedProduct.name}
              viewMode={viewMode}
            />

            {/* Informations du produit */}
            <ProductDetailInfo
              product={selectedProduct}
              currentPrice={currentPrice}
              currentComparePrice={currentComparePrice}
              isInStock={isInStock()}
              selectedAttributes={selectedAttributes}
              onAttributeSelect={selectAttribute}
              viewMode={viewMode}
              onVariantImageChange={handleVariantImageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailBlock;
