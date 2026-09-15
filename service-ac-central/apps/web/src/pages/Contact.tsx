import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { useSettings } from "../hooks/useSettings";
import { submitContactMessage } from "../services/resources";
import { buildWhatsAppLink } from "../utils";

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin konsultasi AC.`,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitContactMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <section className="bg-ink-900 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Hubungi Kami
        </h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
          Kami siap melayani Anda dengan sepenuh hati. Kirim pesan atau langsung
          chat WhatsApp.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Kontak"
              title="Info Kontak Kami"
            />
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-ink-900">Telepon</p>
                  <p className="text-sm text-ink-500">{settings.phoneNumber}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-ink-900">Email</p>
                  <p className="text-sm text-ink-500">{settings.email}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-ink-900">Alamat</p>
                  <p className="text-sm text-ink-500">{settings.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-ink-900">Jam Operasional</p>
                  <p className="text-sm text-ink-500">
                    {settings.operationalHours}
                  </p>
                </div>
              </li>
            </ul>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-wa px-6 py-3 text-sm font-bold text-white hover:bg-wa-dark"
            >
              Chat WhatsApp Langsung
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
          >
            <p className="font-bold text-ink-900">Kirim Pesan</p>
            <p className="mt-1 text-sm text-ink-500">
              Sertakan nomor telepon agar kami mudah menghubungi Anda.
            </p>

            <div className="mt-5 space-y-4">
              <input
                required
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                type="email"
                placeholder="Email (opsional)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                required
                placeholder="Nomor Telepon"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <textarea
                required
                rows={4}
                placeholder="Tulis pesan atau keluhan Anda"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {status === "loading" ? "Mengirim..." : "Kirim Pesan"}
            </button>

            {status === "success" && (
              <p className="mt-3 text-sm font-medium text-emerald-600">
                Pesan berhasil dikirim. Kami akan segera menghubungi Anda.
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm font-medium text-red-600">
                Gagal mengirim pesan. Silakan coba lagi atau hubungi via
                WhatsApp.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
