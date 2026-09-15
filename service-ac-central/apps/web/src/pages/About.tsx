import { BadgeCheck, Clock4, ShieldCheck, Wallet } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useSettings } from "../hooks/useSettings";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Teknisi Ahli dan Terlatih",
    desc: "Tim teknisi kami mampu menangani segala macam masalah AC dengan cara yang tepat dan efektif.",
  },
  {
    icon: ShieldCheck,
    title: "Garansi Service",
    desc: "Kami memastikan layanan yang diberikan memenuhi standar kualitas terbaik, lengkap dengan garansi.",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    desc: "Biaya perbaikan dan perawatan AC yang kami tawarkan kompetitif dan transparan.",
  },
  {
    icon: Clock4,
    title: "Penanganan Cepat",
    desc: "Kami memastikan penanganan yang cepat dan efisien di setiap kunjungan.",
  },
];

export default function About() {
  const { settings } = useSettings();

  return (
    <div>
      <section className="bg-ink-900 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Tentang Kami
        </h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
          Mengenal lebih dekat {settings.companyName}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Profil Kami"
              title={`${settings.companyName}`}
            />
            <p className="mt-4 text-ink-600 leading-relaxed">
              {settings.companyName} adalah jasa service AC terpercaya yang
              berkomitmen memberikan pelayanan terbaik kepada setiap pelanggan.
              Kami memiliki teknisi yang berpengalaman dan terlatih dalam
              memperbaiki segala jenis AC, didukung peralatan canggih dan bahan
              berkualitas tinggi untuk memastikan AC Anda berfungsi dengan
              optimal.
            </p>
            <p className="mt-4 text-ink-600 leading-relaxed">
              Kami menjangkau berbagai wilayah dengan layanan panggilan langsung
              ke lokasi Anda, baik untuk hunian pribadi, perkantoran, maupun
              kawasan industri.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-50 p-10 text-center">
            <p className="text-5xl font-extrabold text-brand-700">
              {settings.stats.find((s) =>
                s.label.toLowerCase().includes("tahun"),
              )?.value ?? 8}
              +
            </p>
            <p className="mt-2 font-semibold text-brand-800">
              Tahun Pengalaman Melayani Pelanggan
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Keunggulan" title="Mengapa Memilih Kami?" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <b.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 font-bold text-ink-900">{b.title}</p>
                <p className="mt-2 text-sm text-ink-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
