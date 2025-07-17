import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send } from 'lucide-react';
import { useTestimonials, CreateTestimonialData } from '@/hooks/useTestimonials';

interface TestimonialFormProps {
  storeId: string;
  productId?: string;
  orderId?: string;
  onSuccess?: () => void;
  className?: string;
}

const TestimonialForm = ({ 
  storeId, 
  productId, 
  orderId, 
  onSuccess,
  className = "" 
}: TestimonialFormProps) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    title: '',
    content: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTestimonial } = useTestimonials();

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_email || !formData.content || formData.rating === 0) {
      return;
    }

    setIsSubmitting(true);

    const testimonialData: CreateTestimonialData = {
      store_id: storeId,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      rating: formData.rating,
      title: formData.title || undefined,
      content: formData.content,
      product_id: productId,
      order_id: orderId
    };

    const result = await createTestimonial(testimonialData);
    
    if (result) {
      // Réinitialiser le formulaire
      setFormData({
        customer_name: '',
        customer_email: '',
        title: '',
        content: '',
        rating: 0
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }

    setIsSubmitting(false);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            className={`p-1 transition-colors ${
              star <= formData.rating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star 
              className="w-6 h-6" 
              fill={star <= formData.rating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Laissez votre avis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <Label htmlFor="customer_name">Votre nom *</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
              placeholder="Votre nom complet"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="customer_email">Votre email *</Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
              placeholder="votre@email.com"
              required
            />
          </div>

          {/* Note */}
          <div>
            <Label>Votre note *</Label>
            <div className="mt-2">
              {renderStars()}
              {formData.rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.rating} étoile{formData.rating > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Titre (optionnel) */}
          <div>
            <Label htmlFor="title">Titre de votre avis</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Résumez votre expérience en quelques mots"
            />
          </div>

          {/* Commentaire */}
          <div>
            <Label htmlFor="content">Votre commentaire *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Partagez votre expérience avec ce produit ou cette boutique..."
              rows={4}
              required
            />
          </div>

          {/* Bouton de soumission */}
          <Button 
            type="submit" 
            disabled={isSubmitting || formData.rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publier mon avis
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Votre avis sera examiné avant publication
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;
