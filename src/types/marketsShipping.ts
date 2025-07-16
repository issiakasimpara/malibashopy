export interface MarketSettings {
  id: string;
  storeId: string;
  enabledCountries: string[]; // codes des pays
  defaultCurrency: string;
  taxSettings: {
    includeTax: boolean;
    taxRate: number;
    taxLabel: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZone {
  id: string;
  storeId: string;
  name: string;
  countries: string[]; // codes des pays
  shippingMethods: string[]; // IDs des méthodes de livraison
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreShippingMethod {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  icon: string;
  availableCountries?: string[];
  conditions?: {
    minOrderAmount?: number;
    maxOrderAmount?: number;
    freeShippingThreshold?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingMethodData {
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
  availableCountries?: string[];
  conditions?: {
    minOrderAmount?: number;
    maxOrderAmount?: number;
    freeShippingThreshold?: number;
  };
}

export interface UpdateMarketSettingsData {
  enabledCountries: string[];
  defaultCurrency: string;
  taxSettings: {
    includeTax: boolean;
    taxRate: number;
    taxLabel: string;
  };
}
