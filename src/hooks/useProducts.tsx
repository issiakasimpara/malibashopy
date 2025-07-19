import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, products } from '@/db';
import { useToast } from './use-toast';
import { eq, desc } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

type Product = InferSelectModel<typeof products>;
type ProductInsert = InferInsertModel<typeof products>;
type ProductUpdate = Partial<ProductInsert>;

export const useProducts = (storeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productList, isLoading, error, refetch } = useQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      console.log('useProducts - Fetching products for store:', storeId);
      
      if (!storeId) {
        console.log('useProducts - No storeId provided, returning empty array');
        return [];
      }

      try {
        const data = await db
          .select()
          .from(products)
          .where(eq(products.storeId, storeId))
          .orderBy(desc(products.createdAt));

        console.log('useProducts - Products fetched:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Error in products query:', error);
        return [];
      }
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const createProduct = useMutation({
    mutationFn: async (productData: Omit<ProductInsert, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!storeId) throw new Error('Store ID required');

      const [newProduct] = await db
        .insert(products)
        .values({ ...productData, storeId })
        .returning();

      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      toast({
        title: "Produit créé !",
        description: "Le produit a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      console.error('Product creation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit. " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: ProductUpdate & { id: string }) => {
      const [updatedProduct] = await db
        .update(products)
        .set(updates)
        .where(eq(products.id, id))
        .returning();

      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      toast({
        title: "Produit mis à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
    },
    onError: (error) => {
      console.error('Product update error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit. " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      await db
        .delete(products)
        .where(eq(products.id, productId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      toast({
        title: "Produit supprimé !",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Product deletion error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    products: productList || [],
    isLoading,
    error,
    createProduct: createProduct.mutateAsync,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isCreating: createProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
    refetchProducts: refetch,
  };
};
