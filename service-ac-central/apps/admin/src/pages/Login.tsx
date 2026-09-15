import { Mail, Snowflake } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { inputClass } from "../components/inputClass";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { admin, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && admin) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Email atau password salah.");
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
            Service AC Central
          </h1>
          <p className="text-sm text-ink-400">Masuk ke Admin Panel</p>
        </div>

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

          <div>
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="Password"
              required
              withLeadingIcon
              autoComplete="current-password"
            />
            <div className="mt-2 text-right">
              <Link
                to="/lupa-password"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-bold text-brand-600 hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
