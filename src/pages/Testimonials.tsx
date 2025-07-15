
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import TestimonialsHeader from '@/components/testimonials/TestimonialsHeader';
import TestimonialsStats from '@/components/testimonials/TestimonialsStats';
import TestimonialsFilters from '@/components/testimonials/TestimonialsFilters';
import TestimonialsList from '@/components/testimonials/TestimonialsList';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_email: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: approved })
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => 
        prev.map(t => t.id === id ? { ...t, is_approved: approved } : t)
      );

      toast({
        title: approved ? "Témoignage approuvé" : "Approbation retirée",
        description: approved 
          ? "Le témoignage est maintenant visible sur votre site." 
          : "Le témoignage n'est plus visible sur votre site."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le témoignage.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Témoignage supprimé",
        description: "Le témoignage a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le témoignage.",
        variant: "destructive"
      });
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'approved') return matchesSearch && testimonial.is_approved;
    if (filter === 'pending') return matchesSearch && !testimonial.is_approved;
    return matchesSearch;
  });

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter(t => t.is_approved).length,
    pending: testimonials.filter(t => !t.is_approved).length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <TestimonialsHeader totalCount={stats.total} />
        <TestimonialsStats 
          total={stats.total}
          approved={stats.approved}
          pending={stats.pending}
        />
        <TestimonialsFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
        />
        <TestimonialsList 
          testimonials={filteredTestimonials}
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default Testimonials;
