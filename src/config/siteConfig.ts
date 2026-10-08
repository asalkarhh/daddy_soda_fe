import { SiteConfig } from '../types/public.types';

export const siteConfig: SiteConfig = {
  brand: {
    name: 'Daddy Soda House',
    tagline: 'Authentic Indian Fizz & High-Growth Franchise Opportunities',
    shortDescription:
      'Daddy Soda House brings authentic Indian soda flavours with high-carbonation fizz, standardized syrup formulation, and high-margin outlet business models.',
    establishedYear: '2024',
  },
  contact: {
    phone: '+919876543210',
    phoneDisplay: '+91 98765 43210',
    whatsappNumber: '+919876543210',
    whatsappDisplay: '+91 98765 43210',
    email: 'franchise@Daddysodahouse.com',
    address: 'Daddy Soda House Corporate Office, FC Road, Shivaji Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    workingHours: 'Mon - Sat: 9:30 AM to 7:00 PM IST',
  },
  socialLinks: {
    instagram: 'https://instagram.com/Daddysodahouse',
    facebook: 'https://facebook.com/Daddysodahouse',
    linkedin: 'https://linkedin.com/company/Daddysodahouse',
    youtube: 'https://youtube.com/@Daddysodahouse',
  },
  flavours: [
    {
      id: 'jeera-masala',
      name: 'Jeera Masala',
      category: 'Spiced Classics',
      tagline: 'The Ultimate Desi Digestive Fizz',
      description:
        'A spicy, aromatic blend of roasted cumin, black salt, and tingling mint soda fizz. A beloved Indian classic designed to refresh and aid digestion.',
      badge: 'Bestseller',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        accent: 'bg-amber-500',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
      },
    },
    {
      id: 'kala-khatta',
      name: 'Kala Khatta',
      category: 'Spiced Classics',
      tagline: 'Tangy Street-Style Blackberry Burst',
      description:
        'Sweet, sour, and spiced jamun berry soda punch with an authentic roadside chatpata twist that transports you back to childhood summers.',
      badge: 'Popular',
      colorScheme: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        accent: 'bg-purple-600',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800',
      },
    },
    {
      id: 'nimbu-lemonade',
      name: 'Nimbu Fresh',
      category: 'Refreshing Citrus',
      tagline: 'Crisp & Zesty Sparkling Lemon',
      description:
        'Pure citrus vibrancy with crisp sparkling bubbles and a hint of rock salt. Perfect all-day thirst quencher for hot Indian climates.',
      badge: 'Classic',
      colorScheme: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-900',
        accent: 'bg-yellow-500',
        badgeBg: 'bg-yellow-100',
        badgeText: 'text-yellow-800',
      },
    },
    {
      id: 'orange-burst',
      name: 'Orange Burst',
      category: 'Refreshing Citrus',
      tagline: 'Sun-Kissed Tangy Orange Fizz',
      description:
        'A lively splash of juicy citrus oranges with maximum fizz. Loved across all age groups for its balance of sweetness and punch.',
      badge: 'Crowd Favourite',
      colorScheme: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-900',
        accent: 'bg-orange-500',
        badgeBg: 'bg-orange-100',
        badgeText: 'text-orange-800',
      },
    },
    {
      id: 'blueberry-blast',
      name: 'Blueberry Blast',
      category: 'Fruity Fizz',
      tagline: 'Modern Fruity Berry Delight',
      description:
        'Vibrant, refreshing wild blueberry soda with a subtle aroma and smooth effervescence crafted for contemporary taste palates.',
      badge: 'Trending',
      colorScheme: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        accent: 'bg-blue-600',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800',
      },
    },
    {
      id: 'green-apple-fizz',
      name: 'Green Apple Fizz',
      category: 'Fruity Fizz',
      tagline: 'Crisp, Tart & Bubbly Sensation',
      description:
        'Juicy Granny Smith apple flavours harmoniously married with tingling carbonated bubbles for a sharp, invigorating punch.',
      badge: 'New',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        accent: 'bg-emerald-600',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800',
      },
    },
    {
      id: 'guava-chilli',
      name: 'Guava Chilli Masala',
      category: 'Spiced Classics',
      tagline: 'Tropical Pink Guava with Spicy Zing',
      description:
        'Sweet ripe pink guava pulp notes combined with red chilli flakes and black salt in an effervescent soda base.',
      badge: 'Chef Choice',
      colorScheme: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-900',
        accent: 'bg-rose-500',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
      },
    },
    {
      id: 'cola-masala',
      name: 'Desi Cola Masala',
      category: 'Spiced Classics',
      tagline: 'Bold Dark Cola Infused with Indian Spices',
      description:
        'Rich classic dark cola soda intensified with our proprietary blend of chatpata spices for a distinct desi kick.',
      badge: 'Classic',
      colorScheme: {
        bg: 'bg-amber-950/10',
        border: 'border-amber-900/20',
        text: 'text-amber-950',
        accent: 'bg-amber-900',
        badgeBg: 'bg-amber-900/10',
        badgeText: 'text-amber-950',
      },
    },
  ],
  benefits: [
    {
      id: 'flavour-appeal',
      title: 'High-Demand Flavour Profiles',
      description:
        'Curated menu of Indian favorites and modern fruit fizzes that appeal to kids, youth, and families all year round.',
      iconName: 'Sparkles',
    },
    {
      id: 'low-footprint',
      title: 'Compact & Scalable Outlets',
      description:
        'Streamlined kiosk and storefront machine setups designed for high-footfall locations with minimal space requirement.',
    },
    {
      id: 'syrup-supply',
      title: 'Standardized Supply Chain',
      description:
        'Direct supply of proprietary food-grade syrups and packaging ensuring consistent taste and healthy gross margins across every cup.',
    },
    {
      id: 'support-guidance',
      title: 'Comprehensive Partner Support',
      description:
        'End-to-end operational guidance including machine installation, recipe training, promotional materials, and inventory replenishment.',
    },
  ],
  onboardingSteps: [
    {
      step: 1,
      title: 'Submit Enquiry',
      description:
        'Fill out the simple online enquiry form with your contact details and preferred city.',
    },
    {
      step: 2,
      title: 'Discuss Opportunity',
      description:
        'Our franchise team connects via WhatsApp and phone to share detailed commercial packages and location feasibility.',
    },
    {
      step: 3,
      title: 'Complete Setup Process',
      description:
        'Finalize agreement, receive machine installation & operator training, and launch your Daddy Soda House outlet.',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'What is Daddy Soda House?',
      answer:
        'Daddy Soda House is a fast-growing Indian beverage brand specializing in high-fizz, flavor-rich sodas ranging from desi classics like Jeera Masala and Kala Khatta to contemporary fruit blasts.',
    },
    {
      id: 'faq-2',
      question: 'How do I apply for a Daddy Soda House franchise?',
      answer:
        'Submit your contact details using our website enquiry form. You will be automatically redirected to WhatsApp to immediately initiate onboarding discussions with our franchise coordinator.',
    },
    {
      id: 'faq-3',
      question: 'What happens after I submit my enquiry?',
      answer:
        'Your enquiry is instantly logged in our backend partner portal. Our business development team connects with you to evaluate your chosen city, footfall location, and setup requirements.',
    },
    {
      id: 'faq-4',
      question: 'Is prior experience in beverage or restaurant business required?',
      answer:
        'No prior restaurant experience is required. Daddy Soda House provides standard operating procedures, automated soda dispensing equipment, syrup dosage guidelines, and complete staff training.',
    },
    {
      id: 'faq-5',
      question: 'What kind of locations work best for a Daddy Soda House outlet?',
      answer:
        'High-footfall commercial zones such as market streets, college hubs, transit points, food courts, shopping plazas, and entertainment zones are ideal for fast customer turnaround.',
    },
    {
      id: 'faq-6',
      question: 'Where can I see investment figures and commercial details?',
      answer:
        'Commercial formats, machine specifications, and setup options are customized based on kiosk vs. shop format and location. These are shared during your initial discovery consultation.',
    },
  ],
  metaPlaceholdersNote:
    'NOTE FOR PRODUCTION: Replace contact numbers, registered corporate office address, and social links with client-confirmed production details before public deployment.',
};
