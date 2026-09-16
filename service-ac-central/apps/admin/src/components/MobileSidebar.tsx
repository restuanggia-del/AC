import {
  HelpCircle,
  Images,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  Snowflake,
  Star,
  Tag,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/layanan", label: "Layanan", icon: Wrench },
  { to: "/paket-harga", label: "Paket Harga", icon: Tag },
  { to: "/portfolio", label: "Portfolio", icon: Images },
  { to: "/team", label: "Team", icon: Users },
  { to: "/lokasi", label: "Lokasi", icon: MapPin },
  { to: "/testimoni", label: "Testimoni", icon: Star },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
  { to: "/pesan", label: "Pesan Masuk", icon: MessageSquare },
  { to: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="clay relative m-3 flex h-[calc(100%-1.5rem)] w-72 flex-col !rounded-[28px]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="clay-bubble h-10 w-10 bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <Snowflake className="h-4.5 w-4.5" />
            </span>
            <p className="text-sm font-extrabold text-ink-900">Admin Panel</p>
          </div>
          <button onClick={onClose} className="clay-icon-btn">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 h-px bg-ink-300/40" />

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "clay-sm bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700"
                    : "text-ink-500 hover:bg-white/60"
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
