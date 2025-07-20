
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, productVariants, variantAttributeValues } from '@/db';
import { useToast } from './use-toast';
import { eq } from 'drizzle-orm';

type ProductVariant = typeof productVariants.$inferSelect;

export const useProductVariants = (productId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: variants, isLoading } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return [];

      const data = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, productId));

      return data;
    },
    enabled: !!productId,
  });

  const createVariant = useMutation({
    mutationFn: async (variant: typeof productVariants.$inferInsert) => {
      const data = await db
        .insert(productVariants)
        .values(variant)
        .returning();

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variante créée !",
        description: "La variante a été ajoutée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la variante. " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductVariant> & { id: string }) => {
      const data = await db
        .update(productVariants)
        .set(updates)
        .where(eq(productVariants.id, id))
        .returning();

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variante mise à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la variante. " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteVariant = useMutation({
    mutationFn: async (id: string) => {
      await db
        .delete(productVariants)
        .where(eq(productVariants.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variante supprimée !",
        description: "La variante a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la variante. " + error.message,
        variant: "destructive",
      });
    },
  });

  const linkAttributeToVariant = useMutation({
    mutationFn: async ({ variantId, attributeValueId }: { variantId: string; attributeValueId: string }) => {
      const data = await db
        .insert(variantAttributeValues)
        .values({ variantId, attributeValueId })
        .returning();

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
    },
  });

  return {
    variants: variants || [],
    isLoading,
    createVariant: createVariant.mutateAsync,
    updateVariant: updateVariant.mutateAsync,
    deleteVariant: deleteVariant.mutate,
    linkAttributeToVariant: linkAttributeToVariant.mutateAsync,
    isCreating: createVariant.isPending,
    isUpdating: updateVariant.isPending,
    isDeleting: deleteVariant.isPending,
  };
};
