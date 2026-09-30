import { SodaBase, SodaFlavor, SodaCream, SodaTopping, CupSize, IceLevel } from '@/types';

export const SODA_BASES: SodaBase[] = [
  {
    id: 'cola',
    name: 'Craft Cola',
    description: 'Dark, bold caramel fountain soda with crisp carbonation bite.',
    price: 79,
    liquidColor: '#36180a',
    liquidGradient: 'linear-gradient(180deg, #4d2310 0%, #200d04 100%)',
    tag: 'Classic'
  },
  {
    id: 'lemon-lime',
    name: 'Lemon-Lime Fizz',
    description: 'Crisp, citrusy and super refreshing with bright lemon zest.',
    price: 79,
    liquidColor: '#c4e538',
    liquidGradient: 'linear-gradient(180deg, #ddf058 0%, #99c21b 100%)',
    tag: 'Zesty'
  },
  {
    id: 'soda-water',
    name: 'Pure Soda Water',
    description: 'Triple-filtered mountain water with extra carbonated fizz.',
    price: 69,
    liquidColor: '#80d8ff',
    liquidGradient: 'linear-gradient(180deg, #b3e5fc 0%, #40c4ff 100%)',
    tag: 'Clean'
  },
  {
    id: 'energy',
    name: 'Voltage Energy',
    description: 'Electrifying taurine & B-vitamin high-voltage fuel.',
    price: 99,
    liquidColor: '#ff9100',
    liquidGradient: 'linear-gradient(180deg, #ffab40 0%, #ff6d00 100%)',
    tag: 'High Energy'
  },
  {
    id: 'root-beer',
    name: 'Vintage Root Beer',
    description: 'Rich spiced sarsaparilla, vanilla bark, and warm herbs.',
    price: 89,
    liquidColor: '#3e2723',
    liquidGradient: 'linear-gradient(180deg, #5d4037 0%, #1b0000 100%)',
    tag: 'Retro'
  },
  {
    id: 'mountain-citrus',
    name: 'Neon Mountain Dew',
    description: 'Charged citrus rush with punchy green-apple and lime kick.',
    price: 89,
    liquidColor: '#76ff03',
    liquidGradient: 'linear-gradient(180deg, #b2ff59 0%, #64dd17 100%)',
    tag: 'Intense'
  }
];

export const SODA_FLAVORS: SodaFlavor[] = [
  { id: 'cherry', name: 'Tart Wild Cherry', emoji: '🍒', category: 'Berry', price: 30, tintColor: '#d90429' },
  { id: 'strawberry', name: 'Fresh Strawberry', emoji: '🍓', category: 'Berry', price: 30, tintColor: '#ff2e63' },
  { id: 'mango', name: 'Alphonso Mango', emoji: '🥭', category: 'Tropical', price: 35, tintColor: '#ffb703' },
  { id: 'blue-raspberry', name: 'Blue Raspberry', emoji: '🫐', category: 'Sour', price: 35, tintColor: '#0077b6' },
  { id: 'passion-fruit', name: 'Passion Fruit', emoji: '🍍', category: 'Tropical', price: 35, tintColor: '#fb8500' },
  { id: 'peach', name: 'Georgia Peach', emoji: '🍑', category: 'Fruit', price: 30, tintColor: '#f4845f' },
  { id: 'fresh-lime', name: 'Persian Lime Squeeze', emoji: '🍋', category: 'Citrus', price: 20, tintColor: '#a7c957' },
  { id: 'blackberry', name: 'Crushed Blackberry', emoji: '🍇', category: 'Berry', price: 35, tintColor: '#7209b7' }
];

export const SODA_CREAMS: SodaCream[] = [
  { id: 'none', name: 'No Cream', description: 'Crisp & light fizz without foam', price: 0, color: 'transparent' },
  { id: 'vanilla', name: 'Sweet Vanilla Cold Foam', description: 'Velvety smooth sweet cream whipped cold', price: 40, color: '#fefae0' },
  { id: 'coconut', name: 'Coconut Dream Cream', description: 'Tropical shredded coconut whipped foam', price: 45, color: '#f8f9fa' },
  { id: 'strawberry-foam', name: 'Whipped Strawberry Cloud', description: 'Light berry-infused pink cold foam', price: 45, color: '#ffccd5' }
];

export const SODA_TOPPINGS: SodaTopping[] = [
  { id: 'mango-boba', name: 'Mango Popping Boba', description: 'Bursts with fresh juicy mango nectar', price: 35 },
  { id: 'strawberry-boba', name: 'Strawberry Popping Boba', description: 'Juicy strawberry liquid-filled pearls', price: 35 },
  { id: 'lychee-jelly', name: 'Lychee Jelly Cubes', description: 'Chewy sweet translucent jelly', price: 30 },
  { id: 'fruit-slices', name: 'Fresh Mint & Lime Wheel', description: 'Freshly cut botanical garnish', price: 25 },
  { id: 'popping-candy', name: 'Fizzy Crackle Candy', description: 'Crackles and pops on your tongue', price: 25 }
];

export const SIZE_CONFIG: Record<CupSize, { label: string; volume: string; addPrice: number }> = {
  'regular': { label: 'Regular', volume: '350 ml', addPrice: 0 },
  'large': { label: 'Large', volume: '500 ml', addPrice: 40 },
  'daddy-tub': { label: 'Daddy Tub', volume: '750 ml', addPrice: 80 }
};

export const ICE_OPTIONS: Array<{ id: IceLevel; label: string; description: string; percentage: number }> = [
  { id: 'light', label: 'Light Ice', description: '25% Ice — Maximum Soda Volume', percentage: 25 },
  { id: 'regular', label: 'Regular Ice', description: '50% Ice — Standard Cold Crisp', percentage: 50 },
  { id: 'extra', label: 'Extra Ice', description: '75% Ice — Ultra Frosty Chill', percentage: 75 }
];
