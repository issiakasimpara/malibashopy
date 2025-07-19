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

export function useProducts(storeId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    // Simulation de données temporaires
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Produit Exemple',
          description: 'Description du produit',
          price: 29.99,
          image_url: 'https://via.placeholder.com/300',
          category: 'Électronique',
          stock_quantity: 10,
          store_id: storeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, [storeId]);

  const createProduct = async (data: Partial<Product>) => {
    // Simulation de création
    console.log('Création de produit:', data);
    return { id: Date.now().toString(), ...data } as Product;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    // Simulation de mise à jour
    console.log('Mise à jour produit:', id, data);
    return data as Product;
  };

  const deleteProduct = async (id: string) => {
    // Simulation de suppression
    console.log('Suppression produit:', id);
  };

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
