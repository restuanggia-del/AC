import { Mail, Snowflake } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { inputClass } from "../components/inputClass";
import { useAuth } from "../hooks/useAuth";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError("Terjadi kesalahan. Coba lagi beberapa saat.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Snowflake className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-lg font-extrabold text-ink-900">
            Lupa Password
          </h1>
          <p className="text-sm text-ink-400">Masukkan email akun admin kamu</p>
        </div>

        {sent ? (
          <div className="mt-8 rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
            Kalau email tersebut terdaftar, link reset password sudah dikirim.
            Silakan cek inbox (atau folder spam) email kamu.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Mengirim..." : "Kirim Link Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link
            to="/login"
            className="font-bold text-brand-600 hover:underline"
          >
            Kembali ke halaman login
          </Link>
        </p>
      </div>
    </div>
  );
}
