// Hook temporaire pour les produits - sera migré vers Drizzle
import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock_quantity: number;
  store_id: string;
  created_at: string;
  updated_at: string;
}

// Stockage temporaire en mémoire
let tempProducts: Product[] = [];

export function useProducts(storeId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    // Charger les produits du store depuis le stockage temporaire
    setTimeout(() => {
      const storeProducts = tempProducts.filter(p => p.store_id === storeId);
      setProducts(storeProducts);
      setIsLoading(false);
    }, 500);
  }, [storeId]);

  const createProduct = async (data: any) => {
    setIsCreating(true);
    try {
      // Simulation de création avec stockage temporaire
      const newProduct: Product = {
        id: Date.now().toString(),
        name: data.name || '',
        description: data.description || '',
        price: parseFloat(data.price) || 0,
        image_url: data.images?.[0] || '',
        category: data.category || '',
        stock_quantity: parseInt(data.inventory_quantity) || 0,
        store_id: storeId || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Ajouter au stockage temporaire
      tempProducts.push(newProduct);

      // Mettre à jour l'état local
      setProducts(prev => [...prev, newProduct]);

      console.log('✅ Produit créé avec succès:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('❌ Erreur création produit:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    // Simulation de mise à jour
    console.log('Mise à jour produit:', id, data);
    return data as Product;
  };

  const deleteProduct = async (id: string) => {
    // Simulation de suppression
    tempProducts = tempProducts.filter(p => p.id !== id);
    setProducts(prev => prev.filter(p => p.id !== id));
    console.log('Produit supprimé:', id);
  };

  return {
    products,
    isLoading,
    isCreating,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
