import { apiClient } from "./apiClient";
import { createResourceApi } from "./resourceFactory";
import type {
  ApiResponse,
  ContactMessage,
  FAQItem,
  LocationArea,
  Portfolio,
  PricePackage,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "../types";

export const serviceApi = createResourceApi<Service>("/services");
export const packageApi = createResourceApi<PricePackage>("/packages");
export const portfolioApi = createResourceApi<Portfolio>("/portfolio");
export const teamApi = createResourceApi<TeamMember>("/team");
export const locationApi = createResourceApi<LocationArea>("/locations");
export const testimonialApi = createResourceApi<Testimonial>("/testimonials");
export const faqApi = createResourceApi<FAQItem>("/faqs");

export const contactApi = {
  getAll: async (status?: string): Promise<ContactMessage[]> => {
    const res = await apiClient.get<ApiResponse<ContactMessage[]>>("/contact", {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },
  updateStatus: async (id: string, status: string): Promise<ContactMessage> => {
    const res = await apiClient.put<ApiResponse<ContactMessage>>(`/contact/${id}`, { status });
    return res.data.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/contact/${id}`);
  },
};

export const settingsApi = {
  get: async (): Promise<SiteSettings> => {
    const res = await apiClient.get<ApiResponse<SiteSettings>>("/settings");
    return res.data.data;
  },
  update: async (payload: Partial<SiteSettings>): Promise<SiteSettings> => {
    const res = await apiClient.put<ApiResponse<SiteSettings>>("/settings", payload);
    return res.data.data;
  },
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post<ApiResponse<{ url: string }>>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // url dari backend berbentuk path relatif (/uploads/xxx), gabungkan dengan origin API
  const apiOrigin = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
  return `${apiOrigin}${res.data.data.url}`;
}
