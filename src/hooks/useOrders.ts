// Hook temporaire pour les commandes - sera migré vers Drizzle
import { useState, useEffect } from 'react';

export interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

// Stockage temporaire en mémoire
let tempOrders: Order[] = [
  {
    id: '1',
    store_id: '1',
    customer_name: 'Jean Dupont',
    customer_email: 'jean.dupont@email.com',
    customer_phone: '+33123456789',
    total_amount: 89.99,
    status: 'confirmed',
    payment_status: 'paid',
    shipping_address: '123 Rue de la Paix, 75001 Paris',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: '1',
        order_id: '1',
        product_id: '1',
        product_name: 'Produit Exemple',
        quantity: 2,
        price: 29.99,
        total: 59.98
      }
    ]
  },
  {
    id: '2',
    store_id: '1',
    customer_name: 'Marie Martin',
    customer_email: 'marie.martin@email.com',
    total_amount: 45.50,
    status: 'pending',
    payment_status: 'pending',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

export function useOrders(storeId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les commandes du store depuis le stockage temporaire
    setTimeout(() => {
      const storeOrders = storeId ? tempOrders.filter(o => o.store_id === storeId) : tempOrders;
      setOrders(storeOrders);
      setIsLoading(false);
    }, 500);
  }, [storeId]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setIsUpdatingStatus(true);
    try {
      // Simulation de mise à jour
      console.log('Mise à jour statut commande:', orderId, status);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: Order['payment_status']) => {
    setIsUpdatingPayment(true);
    try {
      // Simulation de mise à jour
      console.log('Mise à jour statut paiement:', orderId, paymentStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, payment_status: paymentStatus } : order
      ));
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const refetchOrders = async () => {
    setIsLoading(true);
    // Simulation de rechargement
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return {
    orders,
    isLoading,
    isUpdatingStatus,
    isUpdatingPayment,
    error,
    updateOrderStatus,
    updatePaymentStatus,
    refetchOrders,
  };
}
