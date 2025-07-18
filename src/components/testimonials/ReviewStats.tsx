import React from 'react';
import { Star, X } from 'lucide-react';

interface ReviewStatsProps {
  testimonials: Array<{
    rating: number;
    id: string;
  }>;
  showWriteButton?: boolean;
  isFormOpen?: boolean;
  onToggleForm?: () => void;
  className?: string;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({
  testimonials,
  showWriteButton = false,
  isFormOpen = false,
  onToggleForm,
  className = ''
}) => {
  // Calculer les statistiques
  const totalReviews = testimonials.length;
  
  if (totalReviews === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl font-bold text-gray-300 mb-2">0.0</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-gray-300" />
            ))}
          </div>
          <div className="text-sm">Aucun avis pour le moment</div>
        </div>
      </div>
    );
  }

  // Calculer la moyenne
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews;
  
  // Compter les avis par note
  const ratingCounts = {
    5: testimonials.filter(t => t.rating === 5).length,
    4: testimonials.filter(t => t.rating === 4).length,
    3: testimonials.filter(t => t.rating === 3).length,
    2: testimonials.filter(t => t.rating === 2).length,
    1: testimonials.filter(t => t.rating === 1).length,
  };

  // Calculer les pourcentages
  const ratingPercentages = {
    5: (ratingCounts[5] / totalReviews) * 100,
    4: (ratingCounts[4] / totalReviews) * 100,
    3: (ratingCounts[3] / totalReviews) * 100,
    2: (ratingCounts[2] / totalReviews) * 100,
    1: (ratingCounts[1] / totalReviews) * 100,
  };

  const renderStars = (rating: number, size: string = 'w-6 h-6') => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${size} ${
          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Note moyenne à gauche */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center md:justify-start mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-gray-600">
            Basé sur {totalReviews} avis
          </div>
        </div>

        {/* Graphique des notes au centre */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-8">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ratingPercentages[rating as keyof typeof ratingPercentages]}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 w-8 text-right">
                {ratingCounts[rating as keyof typeof ratingCounts]}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton Write Review */}
        <div className="flex justify-center md:justify-end">
          {showWriteButton && onToggleForm ? (
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-3">
                Partagez votre expérience
              </div>

              <button
                onClick={onToggleForm}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
                  transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg
                  ${isFormOpen
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isFormOpen ? (
                  <>
                    <X className="w-4 h-4" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4" />
                    Écrire un avis
                  </>
                )}
              </button>

              {!isFormOpen && (
                <div className="text-xs text-gray-500 mt-2">
                  Aidez les autres clients
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Partagez votre expérience</div>
              <div className="w-32 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Mode éditeur
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
