import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import { fetchServices } from "../services/resources";
import type { Service } from "../types";

const categories = [
  { value: "", label: "Semua" },
  { value: "cuci", label: "Cuci AC" },
  { value: "service", label: "Service AC" },
  { value: "pasang", label: "Pasang AC" },
  { value: "bongkar", label: "Bongkar AC" },
  { value: "freon", label: "Freon" },
  { value: "sparepart", label: "Sparepart" },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchServices(activeCategory || undefined)
      .then(setServices)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 py-16 text-center">
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
        <Reveal direction="up" className="relative">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Layanan Kami
          </h1>
          <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
            Pilih layanan AC sesuai kebutuhan Anda — cepat, bersih, dan
            bergaransi.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal direction="up" className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                activeCategory === c.value
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : services.length === 0 ? (
            <EmptyState message="Belum ada layanan pada kategori ini." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <Reveal key={s._id} direction="up" delay={(i % 4) * 90}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
