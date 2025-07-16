/**
 * Types et interfaces pour le système de livraisons
 */

// Types de base pour les zones de livraison
export interface ShippingZone {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  countries: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingZoneInsert {
  store_id: string;
  name: string;
  description?: string;
  countries: string[];
  is_active?: boolean;
}

export interface ShippingZoneUpdate {
  name?: string;
  description?: string;
  countries?: string[];
  is_active?: boolean;
}

// Types de base pour les méthodes de livraison
export interface ShippingMethod {
  id: string;
  store_id: string;
  shipping_zone_id?: string;
  name: string;
  description?: string;
  icon: string;
  price: number;
  free_shipping_threshold?: number;
  estimated_days: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relations
  shipping_zone?: ShippingZone;
}

export interface ShippingMethodInsert {
  store_id: string;
  shipping_zone_id?: string;
  name: string;
  description?: string;
  icon?: string;
  price: number;
  free_shipping_threshold?: number;
  estimated_days?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface ShippingMethodUpdate {
  shipping_zone_id?: string;
  name?: string;
  description?: string;
  icon?: string;
  price?: number;
  free_shipping_threshold?: number;
  estimated_days?: string;
  is_active?: boolean;
  sort_order?: number;
}

// Types pour le calcul des frais de livraison
export interface ShippingCalculation {
  method: ShippingMethod;
  originalPrice: number;
  calculatedPrice: number;
  isFree: boolean;
  reason?: string; // Pourquoi c'est gratuit (seuil atteint, etc.)
}

export interface ShippingCalculationRequest {
  storeId: string;
  country: string;
  totalAmount: number;
  weight?: number;
  items?: Array<{
    id: string;
    quantity: number;
    weight?: number;
  }>;
}

// Types pour les formulaires
export interface ShippingZoneFormData {
  name: string;
  description: string;
  countries: string[];
  is_active: boolean;
}

export interface ShippingMethodFormData {
  shipping_zone_id: string;
  name: string;
  description: string;
  icon: string;
  price: string; // String pour les formulaires
  free_shipping_threshold: string;
  estimated_days: string;
  is_active: boolean;
}

// Types pour les statistiques
export interface ShippingStats {
  totalMethods: number;
  activeMethods: number;
  totalZones: number;
  activeZones: number;
  averageShippingCost: number;
  freeShippingOrders: number;
  totalShippingRevenue: number;
}

// Types pour les pays disponibles
export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
}

// Constantes pour les icônes de livraison
export const SHIPPING_ICONS = [
  { value: '📦', label: 'Colis standard' },
  { value: '🚚', label: 'Camion' },
  { value: '⚡', label: 'Express' },
  { value: '🏪', label: 'Magasin' },
  { value: '🚲', label: 'Vélo' },
  { value: '🛵', label: 'Scooter' },
  { value: '✈️', label: 'Avion' },
  { value: '🚢', label: 'Bateau' },
  { value: '🎯', label: 'Précis' },
  { value: '💨', label: 'Rapide' },
  { value: '🌍', label: 'International' },
  { value: '🏠', label: 'Domicile' }
] as const;

// Pays francophones d'Afrique
export const AFRICAN_FRANCOPHONE_COUNTRIES: Country[] = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', region: 'Afrique de l\'Ouest' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', region: 'Afrique de l\'Ouest' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', region: 'Afrique de l\'Ouest' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', region: 'Afrique de l\'Ouest' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', region: 'Afrique de l\'Ouest' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', region: 'Afrique de l\'Ouest' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', region: 'Afrique de l\'Ouest' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', region: 'Afrique de l\'Ouest' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷', region: 'Afrique de l\'Ouest' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', region: 'Afrique Centrale' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', region: 'Afrique Centrale' },
  { code: 'CF', name: 'République Centrafricaine', flag: '🇨🇫', region: 'Afrique Centrale' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', region: 'Afrique Centrale' },
  { code: 'CG', name: 'République du Congo', flag: '🇨🇬', region: 'Afrique Centrale' },
  { code: 'CD', name: 'République Démocratique du Congo', flag: '🇨🇩', region: 'Afrique Centrale' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', region: 'Afrique de l\'Est' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', region: 'Afrique de l\'Est' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲', region: 'Afrique de l\'Est' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', region: 'Afrique de l\'Est' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', region: 'Afrique du Nord' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', region: 'Afrique du Nord' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', region: 'Afrique du Nord' }
];

// Types pour les erreurs
export interface ShippingError {
  code: string;
  message: string;
  details?: any;
}

// Types pour les réponses API
export interface ShippingResponse<T> {
  data?: T;
  error?: ShippingError;
  success: boolean;
}

export interface ShippingListResponse<T> {
  data: T[];
  count: number;
  error?: ShippingError;
  success: boolean;
}
