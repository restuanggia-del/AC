import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Reveal direction="scale">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <p className="mt-3 text-lg font-bold text-ink-900">
          Halaman tidak ditemukan
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Halaman yang Anda cari mungkin sudah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30"
        >
          Kembali ke Beranda
        </Link>
      </Reveal>
    </div>
  );
}
