import {
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
  HelpCircle,
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

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-100 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Snowflake className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-ink-900">Service AC Central</p>
          <p className="text-xs text-ink-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-4">
        <p className="rounded-xl bg-ink-50 px-3 py-3 text-[11px] leading-relaxed text-ink-400">
          Perubahan yang Anda simpan di sini akan langsung tampil di website publik.
        </p>
      </div>
    </aside>
  );
}
