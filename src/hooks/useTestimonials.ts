import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Testimonial {
  id: string;
  store_id: string;
  order_id?: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title?: string;
  content: string;
  is_approved: boolean;
  is_featured: boolean;
  product_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTestimonialData {
  store_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title?: string;
  content: string;
  product_id?: string;
  order_id?: string;
}

export const useTestimonials = (storeId?: string, approvedOnly: boolean = true) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      if (approvedOnly) {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
        setError(error.message);
        return;
      }

      setTestimonials(data || []);
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Erreur lors du chargement des témoignages');
    } finally {
      setIsLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: CreateTestimonialData) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du témoignage:', error);
        toast({
          title: "Erreur",
          description: "Impossible de soumettre votre avis. Veuillez réessayer.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Avis soumis !",
        description: "Votre avis a été soumis et sera examiné par l'équipe.",
      });

      return data;
    } catch (err) {
      console.error('Erreur inattendue:', err);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le témoignage.",
          variant: "destructive",
        });
        return null;
      }

      // Mettre à jour la liste locale
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === id ? { ...testimonial, ...updates } : testimonial
        )
      );

      toast({
        title: "Témoignage mis à jour",
        description: "Les modifications ont été sauvegardées.",
      });

      return data;
    } catch (err) {
      console.error('Erreur inattendue:', err);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le témoignage.",
          variant: "destructive",
        });
        return false;
      }

      // Mettre à jour la liste locale
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));

      toast({
        title: "Témoignage supprimé",
        description: "Le témoignage a été supprimé avec succès.",
      });

      return true;
    } catch (err) {
      console.error('Erreur inattendue:', err);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
      return false;
    }
  };

  const approveTestimonial = async (id: string) => {
    return updateTestimonial(id, { is_approved: true });
  };

  const rejectTestimonial = async (id: string) => {
    return updateTestimonial(id, { is_approved: false });
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    return updateTestimonial(id, { is_featured: featured });
  };

  useEffect(() => {
    fetchTestimonials();
  }, [storeId, approvedOnly]);

  return {
    testimonials,
    isLoading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    approveTestimonial,
    rejectTestimonial,
    toggleFeatured,
    refetch: fetchTestimonials
  };
};
