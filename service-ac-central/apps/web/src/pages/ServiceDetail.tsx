import axios from "axios";
import {
  ArrowLeft,
  Check,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import { useSettings } from "../hooks/useSettings";
import { apiClient } from "../services/apiClient";
import { fetchServices } from "../services/resources";
import type { ApiResponse, Service } from "../types";
import { buildTelLink, buildWhatsAppLink, formatRupiah } from "../utils";

const categoryLabels: Record<Service["category"], string> = {
  cuci: "Maintenance",
  service: "Service AC",
  pasang: "Pasang AC",
  bongkar: "Bongkar AC",
  freon: "Isi Freon",
  sparepart: "Sparepart",
  lainnya: "Layanan Lainnya",
};

async function loadService(id: string): Promise<Service | null> {
  try {
    const res = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
    const data = res.data?.data;
    if (!data || !data._id || data.isActive === false) return null;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) return null;
    throw err;
  }
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    window.scrollTo({ top: 0 });
    setLoading(true);
    setError(false);
    setService(null);
    setRelated([]);

    loadService(id)
      .then(async (data) => {
        if (!mounted) return;
        setService(data);
        if (data) {
          document.title = `${data.name} - ${settings.companyName}`;
          try {
            const sameCategory = await fetchServices(data.category);
            if (mounted) {
              setRelated(
                sameCategory.filter((s) => s._id !== data._id).slice(0, 4),
              );
            }
          } catch {}
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, settings.companyName]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState message="Gagal memuat layanan. Silakan coba lagi beberapa saat." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <p className="mt-3 text-lg font-bold text-ink-900">
          Layanan tidak ditemukan
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Layanan ini mungkin sudah tidak tersedia.
        </p>
        <Link
          to="/layanan"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30"
        >
          Lihat Semua Layanan
        </Link>
      </div>
    );
  }

  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin pesan layanan "${service.name} (${service.pkSize})".`,
  );

  const highlights = [
    "Dikerjakan teknisi berpengalaman",
    "Pengerjaan rapi dan bersih",
    "Bergaransi pengerjaan",
    "Konsultasi gratis sebelum pengerjaan",
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 py-12">
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-300">
            <Link to="/" className="hover:text-white">
              Beranda
            </Link>
            <span>/</span>
            <Link to="/layanan" className="hover:text-white">
              Layanan
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{service.name}</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/layanan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Layanan
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-ink-100 bg-brand-50">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Wind className="h-24 w-24 text-brand-400" />
              )}
            </div>
          </Reveal>

          <Reveal direction="left">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              {categoryLabels[service.category] ?? service.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-ink-900 sm:text-4xl">
              {service.name}
            </h1>
            <p className="mt-2 text-ink-500">Ukuran {service.pkSize}</p>

            <p className="mt-6 text-3xl font-extrabold text-brand-700">
              {formatRupiah(service.price)}
            </p>

            {service.description && (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                  Deskripsi Layanan
                </h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-600">
                  {service.description}
                </p>
              </div>
            )}

            <ul className="mt-6 space-y-2.5">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-ink-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-wa px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa-dark hover:shadow-lg hover:shadow-wa/30"
              >
                <MessageCircle className="h-4 w-4" />
                Pesan via WhatsApp
              </a>
              <a
                href={buildTelLink(settings.phoneNumber)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-bold text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
              >
                <Phone className="h-4 w-4" />
                Telepon Kami
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50 p-4">
                <Clock className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="text-xs font-semibold text-ink-400">
                    Jam Operasional
                  </p>
                  <p className="text-sm font-bold text-ink-800">
                    {settings.operationalHours}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50 p-4">
                <ShieldCheck className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="text-xs font-semibold text-ink-400">Jaminan</p>
                  <p className="text-sm font-bold text-ink-800">
                    Teknisi Profesional
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-ink-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Layanan Terkait"
              title="Layanan Lain yang Mungkin Anda Butuhkan"
            />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((s, i) => (
                <Reveal key={s._id} direction="up" delay={(i % 4) * 90}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
