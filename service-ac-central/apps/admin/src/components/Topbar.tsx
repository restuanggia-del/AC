import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import MobileSidebar from "./MobileSidebar";
import UserMenu from "./UserMenu";

export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { query, setQuery } = useSearch();
  const location = useLocation();

  useEffect(() => {
    setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <header className="clay-panel flex items-center gap-3 px-4 py-3 lg:px-5">
        <button
          onClick={() => setMobileOpen(true)}
          className="clay-icon-btn shrink-0 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari data di halaman ini..."
            className="clay-input w-full pl-10 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Bersihkan pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <UserMenu />
      </header>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
