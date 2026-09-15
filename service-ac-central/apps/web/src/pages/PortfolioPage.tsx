import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import PortfolioCard from "../components/PortfolioCard";
import Reveal from "../components/Reveal";
import { fetchPortfolio } from "../services/resources";
import type { Portfolio } from "../types";

const filters = [
  { value: "all", label: "All" },
  { value: "service", label: "Service" },
  { value: "cuci", label: "Cuci" },
  { value: "pasang", label: "Pasang" },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetchPortfolio(activeFilter)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 py-16 text-center">
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
        <Reveal direction="up" className="relative">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Portfolio
          </h1>
          <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
            Dokumentasi hasil kerja teknisi kami di lapangan.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal direction="up" className="flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <EmptyState message="Belum ada portfolio pada kategori ini." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, i) => (
                <Reveal key={item._id} direction="scale" delay={(i % 8) * 70}>
                  <PortfolioCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
