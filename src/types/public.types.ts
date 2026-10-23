export interface PublicEnquiryRequest {
  fullName: string;
  mobile: string;
  email?: string;
  city?: string;
  message?: string;
}

export interface PublicEnquiryData {
  enquiryId: string;
  enquiryNumber: string;
  whatsAppUrl: string;
}

export interface PublicEnquiryResponse {
  success: boolean;
  message: string;
  data: PublicEnquiryData;
  timestamp: string;
}

export interface FlavourItem {
  id: string;
  name: string;
  category: 'Spiced Classics' | 'Fruity Fizz' | 'Refreshing Citrus' | 'All';
  tagline: string;
  description: string;
  badge?: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface FranchiseBenefit {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    shortDescription: string;
    establishedYear: string;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    workingHours: string;
    googleMapsUrl?: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  flavours: FlavourItem[];
  benefits: FranchiseBenefit[];
  onboardingSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  faqs: FaqItem[];
  metaPlaceholdersNote: string;
}
