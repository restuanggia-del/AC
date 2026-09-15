import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import PackageCard from "../components/PackageCard";
import SectionHeading from "../components/SectionHeading";
import { fetchPackages, fetchServices } from "../services/resources";
import type { PricePackage, Service } from "../types";
import { formatRupiah, buildWhatsAppLink } from "../utils";
import { useSettings } from "../hooks/useSettings";

export default function Pricing() {
  const { settings } = useSettings();
  const [packages, setPackages] = useState<PricePackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([fetchPackages(), fetchServices()]).then(([p, s]) => {
      if (p.status === "fulfilled") setPackages(p.value);
      if (s.status === "fulfilled") setServices(s.value);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="bg-ink-900 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Daftar Harga
        </h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
          Harga transparan tanpa biaya tersembunyi. Klik pesan untuk konfirmasi
          via WhatsApp.
        </p>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* PAKET HARGA */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Paket Harga"
              title="Paket Layanan Lengkap"
              description="Sudah termasuk rincian pekerjaan yang akan dilakukan teknisi kami."
            />
            <div className="mt-10">
              {packages.length === 0 ? (
                <EmptyState message="Belum ada paket harga." />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((p) => (
                    <PackageCard key={p._id} pkg={p} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* HARGA PER UNIT (TABEL) */}
          <section className="bg-ink-50 py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Harga Per Unit"
                title="Daftar Harga Jasa Per Unit"
              />
              <div className="mt-10 overflow-hidden rounded-2xl border border-ink-100 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink-900 text-white">
                    <tr>
                      <th className="px-5 py-3 font-bold">Jenis Jasa</th>
                      <th className="px-5 py-3 font-bold">Ukuran</th>
                      <th className="px-5 py-3 font-bold">Harga</th>
                      <th className="px-5 py-3 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {services.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-8 text-center text-ink-400"
                        >
                          Belum ada data harga.
                        </td>
                      </tr>
                    )}
                    {services.map((s) => {
                      const waLink = buildWhatsAppLink(
                        settings.whatsappNumber,
                        `Hallo ${settings.companyName}, saya ingin info harga "${s.name} (${s.pkSize})".`,
                      );
                      return (
                        <tr key={s._id} className="hover:bg-ink-50">
                          <td className="px-5 py-3 font-semibold text-ink-800">
                            {s.name}
                          </td>
                          <td className="px-5 py-3 text-ink-500">{s.pkSize}</td>
                          <td className="px-5 py-3 font-bold text-brand-700">
                            {formatRupiah(s.price)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block rounded-lg bg-wa px-3 py-1.5 text-xs font-bold text-white hover:bg-wa-dark"
                            >
                              Info
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
