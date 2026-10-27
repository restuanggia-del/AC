import axios from "axios";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import PortfolioCard from "../components/PortfolioCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSettings } from "../hooks/useSettings";
import { apiClient } from "../services/apiClient";
import { fetchPortfolio } from "../services/resources";
import type { ApiResponse, Portfolio } from "../types";
import { buildWhatsAppLink } from "../utils";

const categoryLabels: Record<Portfolio["category"], string> = {
  service: "Service",
  cuci: "Cuci AC",
  pasang: "Pasang AC",
};

async function loadPortfolio(id: string): Promise<Portfolio | null> {
  try {
    const res = await apiClient.get<ApiResponse<Portfolio>>(`/portfolio/${id}`);
    const data = res.data?.data;
    if (!data || !data._id || data.isActive === false) return null;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) return null;
    throw err;
  }
}

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const [item, setItem] = useState<Portfolio | null>(null);
  const [related, setRelated] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    window.scrollTo({ top: 0 });
    setLoading(true);
    setError(false);
    setItem(null);
    setRelated([]);

    loadPortfolio(id)
      .then(async (data) => {
        if (!mounted) return;
        setItem(data);
        if (data) {
          document.title = `${data.title} - ${settings.companyName}`;
          try {
            const sameCategory = await fetchPortfolio(data.category);
            if (mounted) {
              setRelated(
                sameCategory.filter((p) => p._id !== data._id).slice(0, 4),
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
        <EmptyState message="Gagal memuat portfolio. Silakan coba lagi beberapa saat." />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <p className="mt-3 text-lg font-bold text-ink-900">
          Portfolio tidak ditemukan
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Portfolio ini mungkin sudah dihapus atau dipindahkan.
        </p>
        <Link
          to="/portfolio"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30"
        >
          Lihat Semua Portfolio
        </Link>
      </div>
    );
  }

  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya melihat portfolio "${item.title}" dan ingin berkonsultasi.`,
  );

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
            <Link to="/portfolio" className="hover:text-white">
              Portfolio
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">{item.title}</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Portfolio
        </Link>

        <Reveal direction="up">
          <div className="mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-ink-50">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[560px] w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal direction="up" delay={100}>
          <div className="mt-8">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              {categoryLabels[item.category] ?? item.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-ink-900 sm:text-4xl">
              {item.title}
            </h1>
            {item.description ? (
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">
                {item.description}
              </p>
            ) : (
              <p className="mt-4 text-ink-400">
                Dokumentasi pekerjaan nyata dari teknisi kami di lapangan.
              </p>
            )}

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-wa px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa-dark hover:shadow-lg hover:shadow-wa/30"
            >
              <MessageCircle className="h-4 w-4" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="bg-ink-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Portfolio Lainnya"
              title="Hasil Kerja Lainnya"
            />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p._id} direction="scale" delay={(i % 4) * 70}>
                  <PortfolioCard item={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
