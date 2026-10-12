export interface CityTierModel {
  id: 'tier3' | 'tier1_2';
  title: string;
  subtitle: string;
  franchiseFee: string;
  franchiseFeeRaw: number;
  totalInvestment: string;
  dailySodaSales: number;
  sodaPricePerGlass: number;
  dailyIceGolaSales: number;
  iceGolaPricePerPiece: number;
  dailyRevenue: number;
  monthlyRevenue: string;
  annualRevenue: string;
  annualProfit25: string;
  annualProfit30: string;
  expectedRoi: string;
  notes: string;
}

export const FRANCHISE_TIERS: Record<'tier3' | 'tier1_2', CityTierModel> = {
  tier3: {
    id: 'tier3',
    title: 'Tier 3 Cities',
    subtitle: 'High penetration model for emerging town centers and high-density markets',
    franchiseFee: '₹2,00,000*',
    franchiseFeeRaw: 200000,
    totalInvestment: '₹12,00,000 – ₹15,00,000',
    dailySodaSales: 250,
    sodaPricePerGlass: 20,
    dailyIceGolaSales: 30,
    iceGolaPricePerPiece: 30,
    dailyRevenue: 5900,
    monthlyRevenue: '₹1.77L*',
    annualRevenue: '₹21 Lakhs',
    annualProfit25: '₹5 Lakhs',
    annualProfit30: '₹6 Lakhs',
    expectedRoi: '18–24 Months',
    notes: '250 glasses/day @ ₹20 + 30 Ice-gola/day @ ₹30 = ₹5,900/day. Projections are indicative and depend on location, footfall & operations.',
  },
  tier1_2: {
    id: 'tier1_2',
    title: 'Tier 1 & 2 Cities',
    subtitle: 'High volume metro & urban flagship experience with premium footfall',
    franchiseFee: '₹2,00,000*',
    franchiseFeeRaw: 200000,
    totalInvestment: '₹15,00,000 – ₹25,00,000',
    dailySodaSales: 350,
    sodaPricePerGlass: 30,
    dailyIceGolaSales: 75,
    iceGolaPricePerPiece: 50,
    dailyRevenue: 14250,
    monthlyRevenue: '₹4.28L*',
    annualRevenue: '₹51 Lakhs',
    annualProfit25: '₹13 Lakhs',
    annualProfit30: '₹15 Lakhs',
    expectedRoi: '18–24 Months',
    notes: '350 glasses/day @ ₹30 + 75 Ice-gola/day @ ₹50 = ₹14,250/day. Projections are indicative and depend on location, footfall & operations.',
  },
};

export const SETUP_EQUIPMENT_INCLUDES = [
  { name: 'Soda dispensing machines (×8 flavors)', icon: '🥤', desc: 'Commercial high-output draft system with 8 dedicated flavor taps' },
  { name: 'Smart POS & billing system', icon: '💻', desc: 'Cloud synced per-glass sales tracking & automated inventory ledger' },
  { name: 'CCTV & remote monitoring', icon: '📹', desc: '24/7 security & live smartphone feed access for absentee owners' },
  { name: 'Branding & signature signage', icon: '✨', desc: 'Official backlit Daddy Soda House fascia, menu boards & 3D emblem' },
  { name: 'Interior & counter furniture', icon: '🪑', desc: 'Sleek wood-fluted counter facade, ambient warm LED bar & shelves' },
  { name: 'Initial stock & consumables', icon: '📦', desc: 'Proprietary flavor concentrates, cups, lids, syrups & branded straws' },
];

export const COMPANY_PROVIDES = [
  'Brand Advertising (Central Level)',
  'Marketing Salesman Support',
  'Quality Control & Compliance',
  'Franchise & Brand Rights',
  'Flavor Liquid Supply',
  'SOP Documentation',
  'Staff Training',
  'Technical & Business Guidance',
];

export const FRANCHISEE_HANDLES = [
  'Outlet Investment',
  'Day-to-Day Operations',
  'Staff Management',
  'Utility Expenses',
  'Compliance & Licenses',
  'Customer Experience',
];

export const PATH_TO_PARTNERSHIP = [
  {
    step: '01',
    title: 'Express Interest',
    desc: 'Share your preferred city, commercial zone, and location details with our franchise development team.',
  },
  {
    step: '02',
    title: 'Initial Meeting',
    desc: 'Discuss your goals, market potential, and expectations directly with Himmat Beverages leadership.',
  },
  {
    step: '03',
    title: 'Site Evaluation',
    desc: 'Identify and finalize the best high-footfall outlet location with our retail location experts.',
  },
  {
    step: '04',
    title: 'Sign Agreement',
    desc: 'Execute the formal franchise agreement and pay the franchise fee. (⏱ 1.5 months countdown to grand opening starts).',
  },
  {
    step: '05',
    title: 'Setup & Training',
    desc: 'Complete machine installation, billing setup, branding, and comprehensive staff onboarding within 1.5 months.',
  },
  {
    step: '06',
    title: 'Grand Opening',
    desc: 'Launch your Daddy Soda House outlet — fully operational and generating revenue within 1.5 months of signing!',
  },
];

export const LEADERSHIP = [
  {
    name: 'Mr. Milind Nandkumar Kadam',
    role: 'CEO & Managing Director',
    desc: "Seasoned business entrepreneur driving the group's strategic vision and successful presence in the society.",
    initials: 'MK',
  },
  {
    name: 'Mr. Ketan Nandkumar Kadam',
    role: 'CEO & Managing Director',
    desc: 'Responsible for strategic growth and operational management across all group businesses, ensuring consistent performance.',
    initials: 'KK',
  },
];

export const HIMMAT_GROUP_DETAILS = {
  est: 1973,
  yearsLegacy: '50+',
  founder: 'Late Shri Nandkumar Shivaji Kadam',
  summary:
    'From a single restaurant to a diversified business conglomerate — Himmat Group has built 50+ years of trust, credibility, and entrepreneurial success across Maharashtra.',
  stats: [
    { value: '50+', label: 'Years of Legacy' },
    { value: '5', label: 'Business Verticals' },
    { value: '1973', label: 'Founded' },
    { value: '2', label: 'Directors' },
  ],
  verticals: [
    { name: 'Himmat Enterprise', desc: 'Commercial trading & enterprise distribution network.', icon: '🏢' },
    { name: 'Himmat Petroleum', desc: 'High-throughput fuel & energy retail stations across Maharashtra.', icon: '⛽' },
    { name: 'Himmat Finance', desc: 'Trusted capital solutions & financial advisory services.', icon: '💼' },
    { name: 'Himmat Liquors', desc: 'Premium retail beverage and hospitality supply chain.', icon: '🍷' },
    { name: 'Himmat Beverages Pvt. Ltd.', desc: 'The manufacturing & franchise arm powering Daddy Soda House.', icon: '🥤' },
  ],
  contact: {
    company: 'Himmat Beverages Pvt. Ltd. | Daddy Soda House',
    phone: '8237522072',
    email: 'himmat.beverages1290@gmail.com',
    address: 'A Venture of Himmat Group of Business (Est. 1973), Maharashtra, India',
  },
};

export const CORE_USPS = [
  {
    title: 'Exclusive Flavor Factory',
    icon: '🧪',
    points: [
      'Own manufacturing plant',
      'Proprietary flavor concentrates',
      'Consistent taste guaranteed',
      'Reliable supply chain',
    ],
  },
  {
    title: 'Tech-Driven Operations',
    icon: '⚙️',
    points: [
      'Smart POS & billing system',
      'Per-glass sale tracking',
      'Remote CCTV monitoring',
      'Automated stock alerts',
    ],
  },
  {
    title: 'No Skilled Staff Needed',
    icon: '👥',
    points: [
      'SOP-based fixed recipes',
      'Easy machine operation',
      'Minimal training required',
      'Consistent output always',
    ],
  },
  {
    title: 'Plug & Play Setup',
    icon: '🔌',
    points: [
      'Everything installed by us',
      'Ready on Day 1 — no delays',
      'No prior experience needed',
      'Full onboarding support',
    ],
  },
  {
    title: 'Run It From Anywhere',
    icon: '📱',
    points: [
      'Remote CCTV monitoring',
      'Live sales on mobile app',
      'Auto billing — zero errors',
      'Daily reports at fingertips',
    ],
  },
  {
    title: 'Hire Any Staff, Anytime',
    icon: '⏱',
    points: [
      'SOP-driven fixed recipes',
      'Anyone can operate machines',
      '1-day training is enough',
      'No chef or expert required',
    ],
  },
];

export const BROCHURE_SODA_FLAVORS = [
  {
    id: 'jeera-masala',
    name: 'Jeera Masala',
    tagline: 'Classic Indian spiced soda — a crowd favourite',
    icon: '🌿',
    color: '#8A5D3B',
    bgColor: '#FAF2E6',
    price: 20,
    priceTier1: 30,
    type: 'soda',
    badge: 'CROWD FAVOURITE',
  },
  {
    id: 'orange-burst',
    name: 'Orange',
    tagline: 'Refreshing citrus burst for every palate',
    icon: '🍊',
    color: '#E8640C',
    bgColor: '#FFF3E8',
    price: 20,
    priceTier1: 30,
    type: 'soda',
    badge: 'CITRUS HIT',
  },
  {
    id: 'lemon-zest',
    name: 'Lemon',
    tagline: 'Zesty & tangy — timeless summer refresher',
    icon: '🍋',
    color: '#C49B00',
    bgColor: '#FEFCE8',
    price: 20,
    priceTier1: 30,
    type: 'soda',
    badge: 'ALL TIME CLASSIC',
  },
  {
    id: 'honey-lemon',
    name: 'Honey Lemon',
    tagline: 'Sweet honey notes with a crisp citrus finish',
    icon: '🍯',
    color: '#D47E00',
    bgColor: '#FFFBEB',
    price: 20,
    priceTier1: 30,
    type: 'soda',
    badge: 'POPULAR',
  },
  {
    id: 'classic-cola',
    name: 'Cola',
    tagline: 'Bold, fizzy cola — a universal favourite',
    icon: '🥤',
    color: '#E6392F',
    bgColor: '#FAF0F0',
    price: 20,
    priceTier1: 30,
    type: 'soda',
    badge: 'UNIVERSAL HIT',
  },
  {
    id: 'fresh-mojito',
    name: 'Mojito',
    tagline: 'Minty fresh mojito — refreshing & trendy',
    icon: '🍃',
    color: '#15803D',
    bgColor: '#F0FDF4',
    price: 20,
    priceTier1: 30,
    type: 'soda',
    badge: 'TRENDY',
  },
  {
    id: 'ice-gola-counter',
    name: 'Ice-Gola Counter',
    tagline: 'Authentic shaved ice golas with signature fruit syrups & Kala Khatta',
    icon: '🍧',
    color: '#D946EF',
    bgColor: '#FDF4FF',
    price: 30,
    priceTier1: 50,
    type: 'gola',
    badge: 'NEW: ₹30/PIECE',
  },
];
