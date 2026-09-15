import { Camera, Mail, MapPin, Phone, Snowflake, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 text-center sm:px-6 lg:grid-cols-4 lg:px-8 lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Snowflake className="h-5 w-5" />
            </span>
            <p className="text-lg font-extrabold text-white">
              {settings.companyName}
            </p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            Jasa cuci, service, pasang AC, dan isi freon dengan teknisi ahli &
            profesional. Melayani panggilan ke rumah dan kantor Anda.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <p className="text-sm font-bold uppercase tracking-wide text-white">
            Navigasi
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/tentang" className="hover:text-white">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link to="/layanan" className="hover:text-white">
                Layanan
              </Link>
            </li>
            <li>
              <Link to="/harga" className="hover:text-white">
                Daftar Harga
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="hover:text-white">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-white">
                Team
              </Link>
            </li>
            <li>
              <Link to="/lokasi" className="hover:text-white">
                Lokasi
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <p className="text-sm font-bold uppercase tracking-wide text-white">
            Layanan Kami
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-400">
            <li>Cuci AC</li>
            <li>Service & Perbaikan AC</li>
            <li>Pasang & Bongkar AC</li>
            <li>Isi & Tambah Freon</li>
          </ul>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <p className="text-sm font-bold uppercase tracking-wide text-white">
            Hubungi Kami
          </p>
          <ul className="mt-4 space-y-3 text-sm text-ink-400">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>{settings.phoneNumber}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>{settings.email}</span>
            </li>
            <li className="flex items-start gap-2 text-left">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>{settings.address}</span>
            </li>
          </ul>
          <div className="mt-4 flex justify-center gap-3 lg:justify-start">
            {settings.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-lg bg-ink-800 p-2 hover:bg-brand-600"
              >
                <Camera className="h-4 w-4" />
              </a>
            )}
            {settings.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-lg bg-ink-800 p-2 hover:bg-brand-600"
              >
                <ThumbsUp className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800 py-5 text-center text-xs text-ink-500">
        © {year} {settings.companyName}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
