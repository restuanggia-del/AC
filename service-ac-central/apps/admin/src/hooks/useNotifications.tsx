import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import { contactApi } from "../services/resources";
import type { ContactMessage } from "../types";

const POLL_INTERVAL_MS = 15000; // cek pesan baru tiap 15 detik

interface NotificationContextValue {
  newMessages: ContactMessage[];
  newCount: number;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

function beep() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => ctx.close();
  } catch {
    // browser memblokir audio sebelum ada interaksi, abaikan saja
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const location = useLocation();
  const [newMessages, setNewMessages] = useState<ContactMessage[]>([]);
  const knownIds = useRef<Set<string> | null>(null);
  const baseTitle = useRef(document.title);

  const refresh = useCallback(async () => {
    try {
      const items = await contactApi.getAll("new");
      const sorted = [...items].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // pemuatan pertama hanya mencatat, tidak memunculkan notifikasi
      if (knownIds.current) {
        const fresh = sorted.filter((m) => !knownIds.current!.has(m._id));
        if (fresh.length === 1) {
          showToast(`Pesan baru dari ${fresh[0].name}`);
          beep();
        } else if (fresh.length > 1) {
          showToast(`${fresh.length} pesan baru masuk`);
          beep();
        }
      }

      knownIds.current = new Set(sorted.map((m) => m._id));
      setNewMessages(sorted);
    } catch {
      // gagal sesaat (offline / server restart), coba lagi di putaran berikutnya
    }
  }, [showToast]);

  // polling berkala
  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  // cek ulang saat tab kembali aktif dan saat pindah halaman
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // angka di judul tab: "(2) Solusi AC Central"
  useEffect(() => {
    const count = newMessages.length;
    document.title =
      count > 0 ? `(${count}) ${baseTitle.current}` : baseTitle.current;
    return () => {
      document.title = baseTitle.current;
    };
  }, [newMessages.length]);

  const value = useMemo(
    () => ({ newMessages, newCount: newMessages.length, refresh }),
    [newMessages, refresh],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications harus digunakan di dalam NotificationProvider",
    );
  return ctx;
}
