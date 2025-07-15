export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export const AFRICAN_FRANCOPHONE_COUNTRIES: Country[] = [
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'BJ',
    name: 'Bénin',
    flag: '🇧🇯',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'CF',
    name: 'République centrafricaine',
    flag: '🇨🇫',
    currency: 'XAF',
    currencySymbol: 'CFA'
  },
  {
    code: 'CG',
    name: 'République du Congo',
    flag: '🇨🇬',
    currency: 'XAF',
    currencySymbol: 'CFA'
  },
  {
    code: 'CI',
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    currency: 'XAF',
    currencySymbol: 'CFA'
  },
  {
    code: 'CD',
    name: 'République démocratique du Congo',
    flag: '🇨🇩',
    currency: 'CDF',
    currencySymbol: 'FC'
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    flag: '🇩🇯',
    currency: 'DJF',
    currencySymbol: 'Fdj'
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    currency: 'XAF',
    currencySymbol: 'CFA'
  },
  {
    code: 'GN',
    name: 'Guinée',
    flag: '🇬🇳',
    currency: 'GNF',
    currencySymbol: 'FG'
  },
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'MG',
    name: 'Madagascar',
    flag: '🇲🇬',
    currency: 'MGA',
    currencySymbol: 'Ar'
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'TD',
    name: 'Tchad',
    flag: '🇹🇩',
    currency: 'XAF',
    currencySymbol: 'CFA'
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    currency: 'XOF',
    currencySymbol: 'CFA'
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'BE',
    name: 'Belgique',
    flag: '🇧🇪',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'CH',
    name: 'Suisse',
    flag: '🇨🇭',
    currency: 'CHF',
    currencySymbol: 'CHF'
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CAD'
  }
];

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  availableCountries: string[]; // codes des pays
  icon: string;
}

export const DEFAULT_SHIPPING_METHODS: Omit<ShippingMethod, 'id'>[] = [
  {
    name: 'Livraison standard',
    description: 'Livraison par transporteur local',
    price: 2500,
    estimatedDays: '3-7 jours',
    isActive: true,
    availableCountries: ['BF', 'BJ', 'CI', 'ML', 'NE', 'SN', 'TG'],
    icon: '📦'
  },
  {
    name: 'Livraison express',
    description: 'Livraison rapide en 24-48h',
    price: 5000,
    estimatedDays: '1-2 jours',
    isActive: true,
    availableCountries: ['BF', 'CI', 'SN'],
    icon: '⚡'
  },
  {
    name: 'Livraison internationale',
    description: 'Livraison vers l\'Europe et l\'Amérique du Nord',
    price: 15000,
    estimatedDays: '7-14 jours',
    isActive: false,
    availableCountries: ['FR', 'BE', 'CH', 'CA'],
    icon: '✈️'
  },
  {
    name: 'Retrait en magasin',
    description: 'Récupération directe en boutique',
    price: 0,
    estimatedDays: 'Immédiat',
    isActive: true,
    availableCountries: [],
    icon: '🏪'
  }
];
