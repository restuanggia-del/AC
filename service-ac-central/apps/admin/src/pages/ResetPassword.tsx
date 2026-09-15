import { Snowflake } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../hooks/useAuth";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Link reset password tidak valid. Silakan minta link baru.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Link reset password tidak valid atau sudah kedaluwarsa.",
      );
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
            Reset Password
          </h1>
          <p className="text-sm text-ink-400">
            Buat password baru untuk akun kamu
          </p>
        </div>

        {success ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
              Password berhasil direset. Silakan login dengan password baru
              kamu.
            </div>
            <Link
              to="/login"
              className="block w-full rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-brand-700"
            >
              Ke Halaman Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!token && (
              <p className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-700">
                Link reset password tidak ditemukan. Pastikan kamu membuka link
                lengkap dari email.
              </p>
            )}

            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Password Baru"
              required
              withLeadingIcon
              autoComplete="new-password"
            />
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Konfirmasi Password Baru"
              required
              withLeadingIcon
              autoComplete="new-password"
            />

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Reset Password"}
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
