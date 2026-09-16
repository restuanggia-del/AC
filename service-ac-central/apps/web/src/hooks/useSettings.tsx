import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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
  heroSubtitle:
    "Teknisi Ahli & Profesional, Siap Membantu AC Anda Kembali Dingin",
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

const RETRY_DELAYS_MS = [800, 1500, 3000];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadWithRetry() {
      for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
        try {
          const data = await fetchSettings();
          if (mounted) {
            setSettings(data);
            setIsLoading(false);
          }
          return;
        } catch (err) {
          const isLastAttempt = attempt === RETRY_DELAYS_MS.length;
          console.error(
            `[useSettings] Gagal mengambil data pengaturan dari API (percobaan ke-${attempt + 1}).` +
              (isLastAttempt
                ? " Menyerah, memakai data default sementara. Pastikan backend API sudah berjalan dan VITE_API_BASE_URL sudah benar."
                : " Mencoba lagi..."),
            err,
          );
          if (isLastAttempt) {
            if (mounted) setIsLoading(false);
            return;
          }
          await delay(RETRY_DELAYS_MS[attempt]);
        }
      }
    }

    loadWithRetry();

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
