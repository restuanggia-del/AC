import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  FAQItem,
  LocationArea,
  Portfolio,
  PricePackage,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "../types";

export async function fetchServices(category?: string): Promise<Service[]> {
  const res = await apiClient.get<ApiResponse<Service[]>>("/services", {
    params: category ? { category } : undefined,
  });
  return res.data.data;
}

export async function fetchPackages(): Promise<PricePackage[]> {
  const res = await apiClient.get<ApiResponse<PricePackage[]>>("/packages");
  return res.data.data;
}

export async function fetchPortfolio(category?: string): Promise<Portfolio[]> {
  const res = await apiClient.get<ApiResponse<Portfolio[]>>("/portfolio", {
    params: category && category !== "all" ? { category } : undefined,
  });
  return res.data.data;
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const res = await apiClient.get<ApiResponse<TeamMember[]>>("/team");
  return res.data.data;
}

export async function fetchLocations(): Promise<LocationArea[]> {
  const res = await apiClient.get<ApiResponse<LocationArea[]>>("/locations");
  return res.data.data;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await apiClient.get<ApiResponse<Testimonial[]>>("/testimonials");
  return res.data.data;
}

export async function fetchFaqs(): Promise<FAQItem[]> {
  const res = await apiClient.get<ApiResponse<FAQItem[]>>("/faqs");
  return res.data.data;
}

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await apiClient.get<ApiResponse<SiteSettings>>("/settings");
  return res.data.data;
}

export async function submitContactMessage(payload: {
  name: string;
  email?: string;
  phone: string;
  message: string;
}): Promise<void> {
  await apiClient.post<ApiResponse<null>>("/contact", payload);
}

export async function submitTestimonial(payload: {
  customerName: string;
  rating: number;
  message: string;
}): Promise<void> {
  await apiClient.post<ApiResponse<null>>("/testimonials", payload);
}
