import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { fetchLocations } from "../services/resources";
import type { LocationArea } from "../types";

export default function LocationPage() {
  const [locations, setLocations] = useState<LocationArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 py-16 text-center">
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
        <Reveal direction="up" className="relative">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Lokasi Teknisi
          </h1>
          <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
            Area layanan kami, agar Anda bisa memperkirakan waktu kedatangan
            teknisi.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeading
            eyebrow="Area Layanan"
            title="Wilayah yang Kami Jangkau"
          />
        </Reveal>
        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : locations.length === 0 ? (
            <EmptyState message="Belum ada data lokasi." />
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {locations.map((loc, i) => (
                <Reveal
                  key={loc._id}
                  direction={i % 2 === 0 ? "right" : "left"}
                  delay={(i % 2) * 100}
                  className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-3">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    <p className="font-bold text-ink-900">{loc.areaName}</p>
                  </div>
                  <iframe
                    src={loc.mapEmbedUrl}
                    title={loc.areaName}
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {loc.description && (
                    <p className="px-5 py-3 text-sm text-ink-500">
                      {loc.description}
                    </p>
                  )}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
