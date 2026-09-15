import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchSettings } from "../services/resources";
import type { SiteSettings } from "../types";

const defaultSettings: SiteSettings = {
  _id: "",
  companyName: "Service AC Central",
  tagline: "Teknisi Ahli & Profesional",
  whatsappNumber: "6281234567890",
  phoneNumber: "081234567890",
  email: "info@serviceaccentral.com",
  address: "Jl. Contoh Alamat No. 123, Jakarta",
  operationalHours: "Setiap Hari, 08.00 - 20.00",
  socialLinks: {},
  heroTitle: "Service AC Central",
  heroSubtitle: "Teknisi Ahli & Profesional, Siap Membantu AC Anda Kembali Dingin",
  stats: [],
};

interface SettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  isLoading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchSettings()
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .catch(() => {
        // Kalau API belum jalan, tetap pakai default supaya UI tidak rusak
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
