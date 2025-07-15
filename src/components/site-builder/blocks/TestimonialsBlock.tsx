
import { TemplateBlock } from '@/types/template';
import { Star } from 'lucide-react';

interface TestimonialsBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
}

const TestimonialsBlock = ({ block, isEditing, viewMode }: TestimonialsBlockProps) => {
  const getResponsiveClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'text-sm px-2';
      case 'tablet':
        return 'text-base px-4';
      default:
        return 'text-base px-6';
    }
  };

  const gridCols = viewMode === 'mobile' ? 'grid-cols-1' : viewMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

  // Données de démonstration pour l'éditeur
  const demoTestimonials = [
    {
      id: '1',
      customer_name: 'Marie Dupont',
      content: 'Excellent service et produits de qualité ! Je recommande vivement.',
      rating: 5
    },
    {
      id: '2',
      customer_name: 'Jean Martin',
      content: 'Livraison rapide et produit conforme à la description.',
      rating: 4
    },
    {
      id: '3',
      customer_name: 'Sophie Bernard',
      content: 'Très satisfaite de mon achat, je reviendrai !',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div 
      className={`py-16 ${getResponsiveClasses()}`}
      style={{ 
        backgroundColor: block.styles.backgroundColor,
        color: block.styles.textColor,
        padding: block.styles.padding
      }}
    >
      <div className="container mx-auto">
        <h2 className={`font-bold text-center mb-12 ${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}>
          {block.content.title || 'Témoignages de nos clients'}
        </h2>
        
        <div className={`grid ${gridCols} gap-8`}>
          {demoTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div className="text-sm font-semibold text-gray-800">
                {testimonial.customer_name}
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 text-sm">
              📝 Mode éditeur : Les vrais témoignages apparaîtront sur votre site publié.
              Gérez-les depuis "Ma Boutique" → "Témoignages"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsBlock;
