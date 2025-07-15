import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCartSessions, CartItem } from '@/hooks/useCartSessions';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  storeId: string | null;
  isLoading: boolean;
  isOpen: boolean;
  addItem: (item: CartItem, storeId: string) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setStoreId: (storeId: string) => void;
  loadCart: (storeId: string) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storeId, setStoreIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const cartSessions = useCartSessions();

  // Calculer les totaux
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fonctions helper
  const getTotalItems = () => totalItems;
  const getTotalPrice = () => totalPrice;
  const toggleCart = () => setIsOpen(!isOpen);

  // Charger le panier pour une boutique
  const loadCart = async (storeId: string) => {
    if (!storeId) return;
    
    try {
      setIsLoading(true);
      const session = await cartSessions.getCartSession(storeId);
      setItems(session?.items || []);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Définir la boutique active
  const setStoreId = (newStoreId: string) => {
    console.log('CartContext: setStoreId called with:', newStoreId);
    if (newStoreId !== storeId) {
      setStoreIdState(newStoreId);
      loadCart(newStoreId);
    }
  };

  // Ajouter un article
  const addItem = async (item: CartItem, itemStoreId: string) => {
    console.log('CartContext: addItem called', { item, itemStoreId, currentStoreId: storeId });
    if (!itemStoreId) {
      console.error('CartContext: itemStoreId manquant dans addItem');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Mettre à jour le store ID d'abord si nécessaire
      if (!storeId || storeId !== itemStoreId) {
        console.log('CartContext: Updating storeId from', storeId, 'to', itemStoreId);
        setStoreIdState(itemStoreId);
      }
      
      const success = await cartSessions.addToCart(itemStoreId, item);
      console.log('CartContext: addToCart result:', success);
      
      if (success) {
        // Recharger le panier après ajout
        await loadCart(itemStoreId);
        console.log('CartContext: Item added successfully, cart reloaded');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un article
  const removeItem = async (productId: string, variantId?: string) => {
    if (!storeId) return;
    
    try {
      setIsLoading(true);
      const success = await cartSessions.removeFromCart(storeId, productId, variantId);
      if (success) {
        await loadCart(storeId);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour la quantité
  const updateQuantity = async (productId: string, quantity: number, variantId?: string) => {
    if (!storeId || quantity < 0) return;
    
    try {
      setIsLoading(true);
      
      if (quantity === 0) {
        // Supprimer l'article si quantité = 0
        await removeItem(productId, variantId);
        return;
      }
      
      // Mettre à jour la quantité localement puis sauvegarder
      const updatedItems = items.map(item => 
        item.product_id === productId && item.variant_id === variantId
          ? { ...item, quantity }
          : item
      );
      
      const session = await cartSessions.getCartSession(storeId);
      const success = await cartSessions.saveCartSession(storeId, updatedItems, session?.customer_info);
      
      if (success) {
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Vider le panier
  const clearCart = async () => {
    if (!storeId) return;
    
    try {
      setIsLoading(true);
      const success = await cartSessions.clearCart(storeId);
      if (success) {
        setItems([]);
      }
    } catch (error) {
      console.error('Erreur lors du vidage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    storeId,
    isLoading,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setStoreId,
    loadCart,
    getTotalItems,
    getTotalPrice,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
