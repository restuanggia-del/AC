import { CheckCircle2, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`clay animate-toast-in flex items-center gap-2 !rounded-2xl px-5 py-3 text-sm font-bold text-white ${
              t.type === "success"
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[6px_6px_16px_rgba(5,150,105,0.35),-6px_-6px_12px_rgba(255,255,255,0.6)]"
                : "bg-gradient-to-br from-rose-400 to-red-600 shadow-[6px_6px_16px_rgba(220,38,38,0.35),-6px_-6px_12px_rgba(255,255,255,0.6)]"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus digunakan di dalam ToastProvider");
  return ctx;
}
