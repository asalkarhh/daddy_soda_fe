export type CategoryType = 'all' | 'classic' | 'fruity' | 'citrus' | 'creamy' | 'energy' | 'limited';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryType;
  price: number;
  image: string;
  ingredients: string[];
  flavorNotes: string[];
  calories: number;
  popular?: boolean;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

export interface SodaBase {
  id: string;
  name: string;
  description: string;
  price: number;
  liquidColor: string;
  liquidGradient: string;
  tag: string;
}

export interface SodaFlavor {
  id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  tintColor: string;
}

export interface SodaCream {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
}

export interface SodaTopping {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type IceLevel = 'light' | 'regular' | 'extra';
export type CupSize = 'regular' | 'large' | 'daddy-tub';

export interface CustomSoda {
  id: string;
  customName: string;
  base: SodaBase;
  flavors: SodaFlavor[];
  cream: SodaCream | null;
  toppings: SodaTopping[];
  ice: IceLevel;
  size: CupSize;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  type: 'preset' | 'custom';
  presetProduct?: Product;
  customSoda?: CustomSoda;
  selectedSize: CupSize;
  selectedIce: IceLevel;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  pincode: string;
  distanceKm: number;
  openHours: string;
  isOpen: boolean;
  phone: string;
  features: string[];
  lat: number;
  lng: number;
}

export interface RewardTier {
  name: string;
  minPoints: number;
  perks: string[];
  badgeColor: string;
}
