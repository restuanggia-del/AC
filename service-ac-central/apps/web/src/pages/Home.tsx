import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Clock,
  Phone,
  ShieldCheck,
  Wallet,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import FaqAccordion from "../components/FaqAccordion";
import Loader from "../components/Loader";
import PortfolioCard from "../components/PortfolioCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import TestimonialCard from "../components/TestimonialCard";
import { useSettings } from "../hooks/useSettings";
import {
  fetchFaqs,
  fetchPortfolio,
  fetchServices,
  fetchTestimonials,
} from "../services/resources";
import type { FAQItem, Portfolio, Service, Testimonial } from "../types";
import { buildTelLink, buildWhatsAppLink } from "../utils";

const whyUs = [
  {
    icon: BadgeCheck,
    title: "Teknisi Ahli & Terlatih",
    desc: "Tim teknisi berpengalaman yang menangani segala macam masalah AC dengan tepat.",
  },
  {
    icon: ShieldCheck,
    title: "Bergaransi",
    desc: "Setiap pengerjaan kami berikan garansi untuk ketenangan Anda.",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    desc: "Tarif kompetitif dan transparan tanpa biaya tersembunyi.",
  },
  {
    icon: Clock,
    title: "Respon Cepat",
    desc: "Siap dipanggil dan datang tepat waktu sesuai jadwal Anda.",
  },
];

export default function Home() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchServices(),
      fetchPortfolio(),
      fetchTestimonials(),
      fetchFaqs(),
    ]).then(([s, p, t, f]) => {
      if (s.status === "fulfilled") setServices(s.value.slice(0, 8));
      if (p.status === "fulfilled") setPortfolio(p.value.slice(0, 6));
      if (t.status === "fulfilled") setTestimonials(t.value.slice(0, 3));
      if (f.status === "fulfilled") setFaqs(f.value.slice(0, 6));
      setLoading(false);
    });
  }, []);

  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin konsultasi AC.`,
  );

  const stats = settings.stats.length
    ? settings.stats
    : [
        { label: "Klien Puas", value: 5000 },
        { label: "Teknisi", value: 25 },
        { label: "Kota Terjangkau", value: 10 },
        { label: "Tahun Pengalaman", value: 8 },
      ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="bg-grid-white absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_65%_65%_at_50%_0%,#000_10%,transparent_75%)]" />
        <div className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-brand-500/25 blur-[100px]" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-700/25 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
          <Reveal direction="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              <Wind className="h-3.5 w-3.5" /> Jasa AC Terpercaya
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-300">
              {settings.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-wa px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-wa/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa-dark hover:shadow-xl hover:shadow-wa/40"
              >
                Chat WhatsApp Sekarang
              </a>
              <a
                href={buildTelLink(settings.phoneNumber)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> Telepon Kami
              </a>
            </div>
          </Reveal>

          <Reveal direction="left" delay={150}>
            <div className="relative mx-auto w-full max-w-md">
              <div className="animate-float absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-transparent to-brand-300/10 blur-2xl" />
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-white/10 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.15]"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <p className="text-2xl font-extrabold text-white">
                        {stat.value}+
                      </p>
                      <p className="mt-1 text-xs font-medium text-ink-300">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeading
            eyebrow="Kenapa Pilih Kami"
            title="Kualitas Terjamin, Pelanggan Tenang"
            description="Kami berkomitmen memberikan hasil maksimal sebelum teknisi meninggalkan lokasi Anda."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, i) => (
            <Reveal key={item.title} direction="up" delay={i * 90}>
              <div className="group h-full rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-600/10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 font-bold text-ink-900">{item.title}</p>
                <p className="mt-2 text-sm text-ink-500">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-ink-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <SectionHeading
              eyebrow="Layanan Kami"
              title="Pilih Layanan Jasa AC Kami"
              description="Berbagai layanan AC untuk rumah, kantor, hingga kawasan industri."
            />
          </Reveal>
          <div className="mt-10">
            {loading ? (
              <Loader />
            ) : services.length === 0 ? (
              <EmptyState message="Belum ada data layanan. Silakan tambahkan lewat Admin Panel." />
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
          <Reveal direction="up" className="mt-10 text-center">
            <Link
              to="/layanan"
              className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
            >
              Lihat Semua Layanan
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeading
            eyebrow="Portfolio"
            title="Hasil Kerja Teknisi Kami"
            description="Dokumentasi pekerjaan nyata dari teknisi berpengalaman kami di lapangan."
          />
        </Reveal>
        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : portfolio.length === 0 ? (
            <EmptyState message="Belum ada data portfolio." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {portfolio.map((p, i) => (
                <Reveal key={p._id} direction="scale" delay={(i % 6) * 70}>
                  <PortfolioCard item={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <Reveal direction="up" className="mt-10 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
          >
            Lihat Semua Portfolio
          </Link>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      {!loading && testimonials.length > 0 && (
        <section className="bg-brand-950 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal direction="up">
              <SectionHeading
                eyebrow="Testimoni"
                title="Apa Kata Pelanggan Kami"
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t._id} direction="up" delay={i * 110}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {!loading && faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <SectionHeading
              eyebrow="FAQ"
              title="Pertanyaan yang Sering Diajukan"
            />
          </Reveal>
          <Reveal direction="up" delay={100} className="mt-10">
            <FaqAccordion faqs={faqs} />
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-600">
        <div className="bg-grid-white absolute inset-0 opacity-20" />
        <Reveal
          direction="up"
          className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            AC Bermasalah? Jangan Ditunda!
          </h2>
          <p className="max-w-xl text-brand-100">
            Hubungi kami sekarang dan dapatkan penanganan cepat dari teknisi
            ahli & profesional.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-lg hover:shadow-black/10"
          >
            Chat WhatsApp Sekarang
          </a>
        </Reveal>
      </section>
    </div>
  );
}
