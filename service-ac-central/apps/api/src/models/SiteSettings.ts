import { Schema, model, Document } from "mongoose";

export interface IStat {
  label: string;
  value: number;
  icon?: string;
}

export interface ISiteSettings extends Document {
  companyName: string;
  tagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  operationalHours: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  stats: IStat[];
}

const statSchema = new Schema<IStat>(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    companyName: { type: String, default: "Service AC Central" },
    tagline: { type: String, default: "Teknisi Ahli & Profesional" },
    whatsappNumber: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    operationalHours: { type: String, default: "Setiap Hari, 08.00 - 20.00" },
    socialLinks: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    heroTitle: { type: String, default: "Service AC Central" },
    heroSubtitle: { type: String, default: "Teknisi Ahli & Profesional" },
    stats: { type: [statSchema], default: [] },
  },
  { timestamps: true }
);

export const SiteSettings = model<ISiteSettings>("SiteSettings", siteSettingsSchema);
