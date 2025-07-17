
import { TemplateBlock } from '@/types/template';
import { Star, MessageCircle } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import TestimonialForm from '@/components/testimonials/TestimonialForm';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface TestimonialsBlockProps {
  block: TemplateBlock;
  isEditing: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (block: TemplateBlock) => void;
  selectedStore?: Store | null;
}

const TestimonialsBlock = ({ block, isEditing, viewMode, selectedStore }: TestimonialsBlockProps) => {
  const { testimonials, isLoading } = useTestimonials(selectedStore?.id, true);

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

  // Utiliser les vrais témoignages si disponibles, sinon les données de démo
  const displayTestimonials = isEditing ? demoTestimonials : (testimonials.length > 0 ? testimonials : demoTestimonials);

  // Limiter à 6 témoignages maximum pour l'affichage
  const limitedTestimonials = displayTestimonials.slice(0, 6);

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

  if (isLoading) {
    return (
      <div className={`py-16 ${getResponsiveClasses()}`}>
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
            <div className={`grid ${gridCols} gap-8`}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {block.content.title || 'Ce que disent nos clients'}
        </h2>

        {limitedTestimonials.length > 0 ? (
          <div className={`grid ${gridCols} gap-8`}>
            {limitedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                {testimonial.title && (
                  <h3 className="font-semibold text-gray-900 mb-2">{testimonial.title}</h3>
                )}
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="text-sm font-semibold text-gray-800">
                  {testimonial.customer_name}
                </div>
                {!isEditing && testimonial.created_at && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun témoignage pour le moment</h3>
            <p className="text-gray-500">Soyez le premier à laisser un avis !</p>
          </div>
        )}

        {/* Formulaire pour laisser un avis (uniquement en mode public) */}
        {!isEditing && selectedStore && (
          <div className="mt-16">
            <TestimonialForm
              storeId={selectedStore.id}
              className="max-w-2xl mx-auto"
            />
          </div>
        )}

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
