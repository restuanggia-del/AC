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
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-ink-50"
      >
        <div className="text-right">
          <p className="text-sm font-bold text-ink-900">{admin?.name}</p>
          <p className="text-xs capitalize text-ink-400">{admin?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {admin?.name?.charAt(0) ?? "A"}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-ink-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lg">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-ink-900">
              {admin?.name}
            </p>
            <p className="truncate text-xs text-ink-400">{admin?.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              to="/akun"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50"
            >
              <UserCircle className="h-4 w-4" /> Pengaturan Akun
            </Link>
          </div>
          <div className="border-t border-ink-100 p-1.5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
