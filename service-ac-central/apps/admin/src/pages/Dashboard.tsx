import {
  HelpCircle,
  Images,
  MessageSquare,
  Star,
  Tag,
  Users,
  Wrench,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
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

const cards = [
  {
    key: "services",
    label: "Layanan",
    icon: Wrench,
    api: serviceApi,
    path: "/layanan",
  },
  {
    key: "packages",
    label: "Paket Harga",
    icon: Tag,
    api: packageApi,
    path: "/paket-harga",
  },
  {
    key: "portfolio",
    label: "Portfolio",
    icon: Images,
    api: portfolioApi,
    path: "/portfolio",
  },
  { key: "team", label: "Team", icon: Users, api: teamApi, path: "/team" },
  {
    key: "locations",
    label: "Lokasi",
    icon: MapPin,
    api: locationApi,
    path: "/lokasi",
  },
  {
    key: "testimonials",
    label: "Testimoni",
    icon: Star,
    api: testimonialApi,
    path: "/testimoni",
  },
  { key: "faqs", label: "FAQ", icon: HelpCircle, api: faqApi, path: "/faq" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [newMessages, setNewMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled(cards.map((c) => c.api.getAll())).then((results) => {
      const next: Record<string, number> = {};
      results.forEach((r, i) => {
        next[cards[i].key] = r.status === "fulfilled" ? r.value.length : 0;
      });
      setCounts(next);
      setLoading(false);
    });

    contactApi
      .getAll("new")
      .then((msgs) => setNewMessages(msgs.length))
      .catch(() => {});
  }, []);

  return (
    <div>
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
    </div>
  );
}
