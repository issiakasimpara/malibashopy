
import { Badge } from '@/components/ui/badge';
import ProductVariantSelector from './ProductVariantSelector';
import AddToCartButton from '../AddToCartButton';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface ProductDetailInfoProps {
  product: Product;
  currentPrice: number;
  currentComparePrice?: number;
  isInStock: boolean;
  selectedAttributes: Record<string, string>;
  onAttributeSelect: (attributeType: string, valueId: string) => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onVariantImageChange: (images: string[]) => void;
}

const ProductDetailInfo = ({
  product,
  currentPrice,
  currentComparePrice,
  isInStock,
  selectedAttributes,
  onAttributeSelect,
  viewMode,
  onVariantImageChange
}: ProductDetailInfoProps) => {
  console.log('ProductDetailInfo - Rendering with:', {
    productName: product.name,
    productId: product.id,
    currentPrice,
    currentComparePrice,
    isInStock,
    inventoryQuantity: product.inventory_quantity
  });

  const stockQuantity = product.inventory_quantity || 0;
  const isLowStock = stockQuantity <= 5 && stockQuantity > 0;

  return (
    <div className="space-y-6">
      {/* Titre et évaluation */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
            <span className="text-sm text-gray-600 ml-2">(4.8) • 127 avis</span>
          </div>
        </div>
      </div>

      {/* Prix */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl lg:text-3xl font-bold text-blue-600">{currentPrice} CFA</span>
          {currentComparePrice && currentComparePrice > currentPrice && (
            <span className="text-lg text-gray-500 line-through">{currentComparePrice} CFA</span>
          )}
          {currentComparePrice && currentComparePrice > currentPrice && (
            <Badge className="bg-red-500 text-white">
              -{Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Statut de stock */}
      <div className="flex items-center gap-2 mb-6">
        <Badge 
          variant={isInStock ? 'default' : 'secondary'}
          className={isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        >
          {isInStock ? '✓ En stock' : '✗ Rupture de stock'}
        </Badge>
        {isLowStock && (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Plus que {stockQuantity} en stock
          </Badge>
        )}
      </div>

      {/* Sélecteur de variantes avec vraies données */}
      <ProductVariantSelector
        productId={product.id}
        selectedAttributes={selectedAttributes}
        onAttributeSelect={onAttributeSelect}
        viewMode={viewMode}
        onVariantImageChange={onVariantImageChange}
      />

      {/* Description courte */}
      {product.description && (
        <div className="border-t pt-6">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description.length > 200 
              ? `${product.description.slice(0, 200)}...` 
              : product.description
            }
          </p>
        </div>
      )}

      {/* Actions principales */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex gap-3">
          <AddToCartButton 
            product={{
              id: product.id,
              name: product.name,
              price: Number(currentPrice),
              images: product.images || [],
              sku: product.sku || ''
            }}
            storeId={product.store_id}
            className="flex-1"
            size="lg"
            disabled={!isInStock}
          />
          <Button
            variant="outline"
            size="lg"
            className="px-4"
            disabled={!isInStock}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-4"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {isInStock && (
          <Button 
            className="w-full" 
            size="lg"
            variant="secondary"
          >
            Acheter maintenant
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailInfo;
