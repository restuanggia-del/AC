import { useState } from "react";
import { Menu, Snowflake, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { buildWhatsAppLink } from "../utils";

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Tentang", to: "/tentang" },
  { label: "Layanan", to: "/layanan" },
  { label: "Harga", to: "/harga" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Team", to: "/team" },
  { label: "Lokasi", to: "/lokasi" },
  { label: "Kontak", to: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();
  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin konsultasi AC.`,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Snowflake className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-ink-900">
              Service AC Central
            </p>
            <p className="text-xs font-medium text-ink-500">
              Teknisi Ahli & Profesional
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-wa px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-wa/30 transition hover:bg-wa-dark"
          >
            Konsultasi Gratis
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 lg:hidden"
          aria-label="Buka menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-wa px-4 py-2.5 text-sm font-bold text-white"
            >
              Konsultasi Gratis
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
