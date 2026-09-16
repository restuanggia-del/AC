import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserMenu() {
  const { admin, logout } = useAuth();
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

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="clay-sm flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-200 hover:-translate-y-0.5"
      >
        <div className="text-right">
          <p className="text-sm font-bold text-ink-900">{admin?.name}</p>
          <p className="text-xs capitalize text-ink-400">{admin?.role}</p>
        </div>
        <div className="clay-bubble h-9 w-9 rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-sm font-bold text-white">
          {admin?.name?.charAt(0) ?? "A"}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-ink-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="clay absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden !rounded-2xl">
          <div className="px-4 py-3">
            <p className="truncate text-sm font-bold text-ink-900">
              {admin?.name}
            </p>
            <p className="truncate text-xs text-ink-400">{admin?.email}</p>
          </div>
          <div className="mx-3 h-px bg-ink-200/50" />
          <div className="p-1.5">
            <Link
              to="/akun"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-600 hover:bg-white/70"
            >
              <UserCircle className="h-4 w-4" /> Pengaturan Akun
            </Link>
          </div>
          <div className="mx-3 h-px bg-ink-200/50" />
          <div className="p-1.5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
