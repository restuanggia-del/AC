export interface Service {
  _id: string;
  name: string;
  category: "cuci" | "service" | "pasang" | "bongkar" | "freon" | "sparepart" | "lainnya";
  pkSize: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

export interface ChecklistItem {
  item: string;
  included: boolean;
}

export interface PricePackage {
  _id: string;
  name: string;
  pkSize: string;
  price: number;
  checklist: ChecklistItem[];
  isActive: boolean;
  order: number;
}

export interface Portfolio {
  _id: string;
  title: string;
  category: "service" | "cuci" | "pasang";
  imageUrl: string;
  description?: string;
  isActive: boolean;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  photoUrl?: string;
  description?: string;
  socialLinks?: SocialLinks;
  isActive: boolean;
  order: number;
}

export interface LocationArea {
  _id: string;
  areaName: string;
  mapEmbedUrl: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  photoUrl?: string;
  rating: number;
  message: string;
  isPublished: boolean;
  createdAt: string;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface Stat {
  label: string;
  value: number;
  icon?: string;
}

export interface SiteSettings {
  _id: string;
  companyName: string;
  tagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  operationalHours: string;
  socialLinks: SocialLinks;
  heroTitle: string;
  heroSubtitle: string;
  stats: Stat[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
