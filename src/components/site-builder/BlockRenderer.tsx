
import { TemplateBlock } from '@/types/template';
import HeroBlock from './blocks/HeroBlock';
import ProductsBlock from './blocks/ProductsBlock';
import ProductDetailBlock from './blocks/ProductDetailBlock';
import TextImageBlock from './blocks/TextImageBlock';
import TextVideoBlock from './blocks/TextVideoBlock';
import ContactBlock from './blocks/ContactBlock';
import GalleryBlock from './blocks/GalleryBlock';
import VideoBlock from './blocks/VideoBlock';
import FooterBlock from './blocks/FooterBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import TestimonialsBlock from './blocks/TestimonialsBlock';
import FAQBlock from './blocks/FAQBlock';
import BeforeAfterBlock from './blocks/BeforeAfterBlock';
import ComparisonBlock from './blocks/ComparisonBlock';
import CartBlock from './blocks/CartBlock';
import CheckoutBlock from './blocks/CheckoutBlock';
import GuaranteesBlock from './blocks/GuaranteesBlock';
import DefaultBlock from './blocks/DefaultBlock';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface BlockRendererProps {
  block: TemplateBlock;
  isEditing?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
  productId?: string | null;
  onProductClick?: (productId: string) => void;
}

const BlockRenderer = ({ 
  block, 
  isEditing = false, 
  viewMode = 'desktop',
  onUpdate,
  selectedStore,
  productId,
  onProductClick
}: BlockRendererProps) => {
  console.log('BlockRenderer - Rendering block:', block.type, 'with productId:', productId);
  
  const blockProps = {
    block,
    isEditing,
    viewMode,
    onUpdate,
    selectedStore,
    productId,
    onProductClick
  };

  switch (block.type) {
    case 'hero':
      return <HeroBlock {...blockProps} />;
    case 'products':
      return <ProductsBlock {...blockProps} />;
    case 'product-detail':
      console.log('BlockRenderer - Rendering ProductDetailBlock with productId:', productId);
      return <ProductDetailBlock {...blockProps} />;
    case 'text-image':
      return <TextImageBlock {...blockProps} />;
    case 'text-video':
      return <TextVideoBlock {...blockProps} />;
    case 'contact':
      return <ContactBlock {...blockProps} />;
    case 'gallery':
      return <GalleryBlock {...blockProps} />;
    case 'video':
      return <VideoBlock {...blockProps} />;
    case 'footer':
      return <FooterBlock {...blockProps} />;
    case 'features':
      return <FeaturesBlock {...blockProps} />;
    case 'testimonials':
      return <TestimonialsBlock {...blockProps} />;
    case 'faq':
      return <FAQBlock {...blockProps} />;
    case 'before-after':
      return <BeforeAfterBlock {...blockProps} />;
    case 'comparison':
      return <ComparisonBlock {...blockProps} />;
    case 'cart':
      return <CartBlock {...blockProps} />;
    case 'checkout':
      return <CheckoutBlock {...blockProps} />;
    case 'guarantees':
      return <GuaranteesBlock {...blockProps} />;
    default:
      return <DefaultBlock {...blockProps} />;
  }
};

export default BlockRenderer;
