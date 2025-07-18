
import React, { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { Star, MessageCircle } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import TestimonialForm from '@/components/testimonials/TestimonialForm';
import { ReviewStats } from '@/components/testimonials/ReviewStats';
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
  const [isFormOpen, setIsFormOpen] = useState(false);

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
          {block.content.title || 'Customer Reviews'}
        </h2>

        {/* NOUVELLE INTERFACE PROFESSIONNELLE */}

        {/* 1. Section Statistiques avec bouton Write Review */}
        <div className="mb-8">
          <ReviewStats
            testimonials={limitedTestimonials}
            showWriteButton={!isEditing && !!selectedStore}
            isFormOpen={isFormOpen}
            onToggleForm={() => setIsFormOpen(!isFormOpen)}
          />
        </div>

        {/* 2. Formulaire (affiché conditionnellement) */}
        {!isEditing && selectedStore && isFormOpen && (
          <div className="mb-8">
            <TestimonialForm
              storeId={selectedStore.id}
              onCancel={() => setIsFormOpen(false)}
              className="max-w-2xl mx-auto"
            />
          </div>
        )}

        {/* 3. Liste des avis */}
        {limitedTestimonials.length > 0 ? (
          <div className="space-y-4">
            {limitedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.customer_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{testimonial.customer_name}</h4>
                      <div className="flex items-center">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    {testimonial.title && (
                      <h5 className="font-medium text-gray-800 mb-2">{testimonial.title}</h5>
                    )}

                    <p className="text-gray-600 mb-3">"{testimonial.content}"</p>

                    {!isEditing && testimonial.created_at && (
                      <div className="text-xs text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>

                </div>
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
