import { KeyRound, Mail, Snowflake, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { inputClass } from "../components/inputClass";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { admin, isLoading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && admin) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password, registrationCode });
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registrasi gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="clay w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <span className="clay-bubble h-14 w-14 bg-gradient-to-br from-brand-400 to-brand-600 text-white">
            <Snowflake className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-lg font-extrabold text-ink-900">
            Daftar Admin Baru
          </h1>
          <p className="text-sm text-ink-400">
            Service AC Central - Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              required
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

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

          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Password"
            required
            withLeadingIcon
            autoComplete="new-password"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Konfirmasi Password"
            required
            withLeadingIcon
            autoComplete="new-password"
          />

          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              required
              placeholder="Kode Registrasi"
              value={registrationCode}
              onChange={(e) => setRegistrationCode(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
          <p className="-mt-2 text-xs text-ink-400">
            Minta kode registrasi ini ke admin/developer yang mengelola website.
          </p>

          {error && (
            <p className="clay-inset px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="clay-btn clay-btn-primary w-full py-3"
          >
            {submitting ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-bold text-brand-600 hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
