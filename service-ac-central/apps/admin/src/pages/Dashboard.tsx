import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Clock,
  HelpCircle,
  Images,
  Mail,
  MapPin,
  MessageSquare,
  Star,
  Tag,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import BarChart from "../components/charts/BarChart";
import DonutChart from "../components/charts/DonutChart";
import MiniCalendar from "../components/MiniCalendar";
import PageHeader from "../components/PageHeader";
import {
  contactApi,
  faqApi,
  locationApi,
  packageApi,
  portfolioApi,
  serviceApi,
  teamApi,
  testimonialApi,
} from "../services/resources";
import type { ContactMessage, Testimonial } from "../types";

const cards = [
  { key: "services", label: "Layanan", icon: Wrench, path: "/layanan" },
  { key: "packages", label: "Paket Harga", icon: Tag, path: "/paket-harga" },
  { key: "portfolio", label: "Portfolio", icon: Images, path: "/portfolio" },
  { key: "team", label: "Team", icon: Users, path: "/team" },
  { key: "locations", label: "Lokasi", icon: MapPin, path: "/lokasi" },
  { key: "testimonials", label: "Testimoni", icon: Star, path: "/testimoni" },
  { key: "faqs", label: "FAQ", icon: HelpCircle, path: "/faq" },
];

const dayShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} jam lalu`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type ActivityItem = {
  type: "message" | "testimonial";
  title: string;
  subtitle: string;
  date: string;
};

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeServices, setActiveServices] = useState(0);

  useEffect(() => {
    Promise.allSettled([
      serviceApi.getAll(),
      packageApi.getAll(),
      portfolioApi.getAll(),
      teamApi.getAll(),
      locationApi.getAll(),
      testimonialApi.getAll(),
      faqApi.getAll(),
      contactApi.getAll(),
    ]).then(
      ([
        services,
        packages,
        portfolio,
        team,
        locations,
        testi,
        faqs,
        contacts,
      ]) => {
        setCounts({
          services: services.status === "fulfilled" ? services.value.length : 0,
          packages: packages.status === "fulfilled" ? packages.value.length : 0,
          portfolio:
            portfolio.status === "fulfilled" ? portfolio.value.length : 0,
          team: team.status === "fulfilled" ? team.value.length : 0,
          locations:
            locations.status === "fulfilled" ? locations.value.length : 0,
          testimonials: testi.status === "fulfilled" ? testi.value.length : 0,
          faqs: faqs.status === "fulfilled" ? faqs.value.length : 0,
        });
        if (services.status === "fulfilled") {
          setActiveServices(services.value.filter((s) => s.isActive).length);
        }
        if (testi.status === "fulfilled") setTestimonials(testi.value);
        if (contacts.status === "fulfilled") setMessages(contacts.value);
        setLoading(false);
      },
    );
  }, []);

  const newMessages = messages.filter((m) => m.status === "new").length;
  const readMessages = messages.filter((m) => m.status === "read").length;
  const archivedMessages = messages.filter(
    (m) => m.status === "archived",
  ).length;

  const publishedTestimonials = testimonials.filter((t) => t.isPublished);
  const avgRating = publishedTestimonials.length
    ? (
        publishedTestimonials.reduce((sum, t) => sum + t.rating, 0) /
        publishedTestimonials.length
      ).toFixed(1)
    : "-";

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const messagesPerDay = last7.map((d) => {
    const key = toDateKey(d);
    const value = messages.filter(
      (m) => toDateKey(new Date(m.createdAt)) === key,
    ).length;
    return { label: dayShort[d.getDay()], value };
  });

  const calendarMarkers: Record<string, number> = {};
  messages.forEach((m) => {
    const key = toDateKey(new Date(m.createdAt));
    calendarMarkers[key] = (calendarMarkers[key] ?? 0) + 1;
  });

  const contentDistribution = [
    { label: "Layanan", value: counts.services ?? 0, color: "#2681ff" },
    { label: "Paket Harga", value: counts.packages ?? 0, color: "#4fa2ff" },
    { label: "Portfolio", value: counts.portfolio ?? 0, color: "#86c4ff" },
    { label: "Team", value: counts.team ?? 0, color: "#0f4cc2" },
    { label: "Lokasi", value: counts.locations ?? 0, color: "#123f9a" },
    { label: "Testimoni", value: counts.testimonials ?? 0, color: "#f59e0b" },
    { label: "FAQ", value: counts.faqs ?? 0, color: "#10b981" },
  ];
  const maxDistribution = Math.max(
    1,
    ...contentDistribution.map((d) => d.value),
  );

  const recentActivity: ActivityItem[] = [
    ...messages.map((m) => ({
      type: "message" as const,
      title: `Pesan dari ${m.name}`,
      subtitle: m.message,
      date: m.createdAt,
    })),
    ...testimonials.map((t) => ({
      type: "testimonial" as const,
      title: `Testimoni dari ${t.customerName}`,
      subtitle: t.message,
      date: t.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan data website Service AC Central."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="/pesan"
          className="clay-card block bg-gradient-to-br from-brand-50 to-brand-100/70 transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="clay-bubble h-11 w-11 bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <MessageSquare className="h-5 w-5" />
            </span>
            <p className="text-2xl font-extrabold text-brand-700">
              {newMessages}
            </p>
          </div>
          <p className="mt-3 text-sm font-bold text-brand-800">
            Pesan Baru Masuk
          </p>
        </a>

        {cards.map((c) => (
          <a
            key={c.key}
            href={c.path}
            className="clay-card block transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="clay-bubble h-11 w-11 bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="text-2xl font-extrabold text-ink-900">
                {loading ? "-" : (counts[c.key] ?? 0)}
              </p>
            </div>
            <p className="mt-3 text-sm font-bold text-ink-700">{c.label}</p>
          </a>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="clay-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-ink-900">
                Pesan Masuk — 7 Hari Terakhir
              </p>
              <p className="text-xs text-ink-400">
                Jumlah pesan yang diterima per hari
              </p>
            </div>
            <span className="clay-bubble h-9 w-9 bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <BarChart data={messagesPerDay} />
        </div>

        <div className="clay-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-extrabold text-ink-900">Status Pesan Masuk</p>
            <span className="clay-bubble h-9 w-9 bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600">
              <Mail className="h-4 w-4" />
            </span>
          </div>
          <DonutChart
            centerLabel="Pesan"
            data={[
              { label: "Baru", value: newMessages, color: "#2681ff" },
              { label: "Dibaca", value: readMessages, color: "#cbd5e1" },
              {
                label: "Diarsipkan",
                value: archivedMessages,
                color: "#f59e0b",
              },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="clay-card lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-ink-900">
                Distribusi Konten Website
              </p>
              <p className="text-xs text-ink-400">
                {activeServices} dari {counts.services ?? 0} layanan sedang
                aktif · Rating testimoni rata-rata {avgRating}
                {avgRating !== "-" && (
                  <span className="text-amber-500"> ★</span>
                )}
              </p>
            </div>
            <span className="clay-bubble h-9 w-9 bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="space-y-3.5">
            {contentDistribution.map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-ink-600">
                  <span>{d.label}</span>
                  <span className="font-bold text-ink-900">{d.value}</span>
                </div>
                <div className="clay-inset h-2.5 overflow-hidden !rounded-full !shadow-none">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(d.value / maxDistribution) * 100}%`,
                      background: `linear-gradient(90deg, ${d.color}99, ${d.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="clay-card">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-extrabold text-ink-900">Kalender Aktivitas</p>
            <span className="clay-bubble h-9 w-9 bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600">
              <CalendarDays className="h-4 w-4" />
            </span>
          </div>
          <MiniCalendar markers={calendarMarkers} />
          <p className="mt-3 text-center text-[11px] text-ink-400">
            Tanggal bertitik menandakan ada pesan masuk pada hari itu.
          </p>
        </div>
      </div>

      <div className="clay-card">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-extrabold text-ink-900">Aktivitas Terbaru</p>
          <span className="clay-bubble h-9 w-9 bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600">
            <Clock className="h-4 w-4" />
          </span>
        </div>

        {recentActivity.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-400">
            Belum ada aktivitas.
          </p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="clay-sm flex items-start gap-3 px-4 py-3">
                <span
                  className={`clay-bubble h-9 w-9 shrink-0 text-white ${
                    a.type === "message"
                      ? "bg-gradient-to-br from-brand-400 to-brand-600"
                      : "bg-gradient-to-br from-amber-400 to-amber-600"
                  }`}
                >
                  {a.type === "message" ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-ink-800">
                      {a.title}
                    </p>
                    <p className="shrink-0 text-[11px] font-semibold text-ink-400">
                      {timeAgo(a.date)}
                    </p>
                  </div>
                  <p className="truncate text-xs text-ink-500">{a.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Archive className="h-3.5 w-3.5" /> {archivedMessages} pesan telah
        diarsipkan sepanjang waktu.
      </div>
    </div>
  );
}
