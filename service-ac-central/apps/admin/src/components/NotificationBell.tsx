import { Bell, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

function timeAgo(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} jam lalu`;
  return `${Math.floor(hour / 24)} hari lalu`;
}

export default function NotificationBell() {
  const { newMessages, newCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const preview = newMessages.slice(0, 5);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifikasi"
        className="clay-icon-btn relative"
      >
        <Bell className="h-5 w-5" />
        {newCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow">
            {newCount > 99 ? "99+" : newCount}
          </span>
        )}
      </button>

      {open && (
        <div className="clay absolute right-0 top-full z-50 mt-2 w-80 max-w-[85vw] overflow-hidden !rounded-2xl">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-extrabold text-ink-900">Notifikasi</p>
            {newCount > 0 && (
              <span className="text-xs font-semibold text-brand-700">
                {newCount} pesan baru
              </span>
            )}
          </div>
          <div className="mx-3 h-px bg-ink-200/50" />

          {preview.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-400">
              Belum ada pesan baru.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto p-1.5">
              {preview.map((m) => (
                <Link
                  key={m._id}
                  to="/pesan"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-white/70"
                >
                  <span className="clay-bubble mt-0.5 h-8 w-8 shrink-0 bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-ink-900">
                        {m.name}
                      </p>
                      <p className="shrink-0 text-[11px] font-semibold text-ink-400">
                        {timeAgo(m.createdAt)}
                      </p>
                    </div>
                    <p className="truncate text-xs text-ink-500">{m.message}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mx-3 h-px bg-ink-200/50" />
          <div className="p-1.5">
            <Link
              to="/pesan"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-white/70"
            >
              Lihat semua pesan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
