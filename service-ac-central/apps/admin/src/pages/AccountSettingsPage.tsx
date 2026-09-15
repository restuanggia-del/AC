import { Save } from "lucide-react";
import { useState } from "react";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";

export default function AccountSettingsPage() {
  const { admin, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const wantsPasswordChange =
    newPassword.length > 0 || confirmPassword.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (wantsPasswordChange) {
      if (!currentPassword) {
        setError("Isi password saat ini untuk mengganti password.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Password baru minimal 6 karakter.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Konfirmasi password baru tidak cocok.");
        return;
      }
    }

    setSaving(true);
    try {
      await updateProfile({
        name,
        email,
        currentPassword: wantsPasswordChange ? currentPassword : undefined,
        newPassword: wantsPasswordChange ? newPassword : undefined,
      });
      showToast("Akun berhasil diperbarui");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal memperbarui akun.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Pengaturan Akun"
        description="Kelola nama, email, dan password akun admin kamu."
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-ink-900">Informasi Akun</p>
          <div className="space-y-4">
            <FormField label="Nama">
              <input
                required
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormField>
            <FormField label="Email">
              <input
                required
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-1 font-bold text-ink-900">Ganti Password</p>
          <p className="mb-4 text-xs text-ink-400">
            Kosongkan bagian ini kalau tidak ingin mengganti password.
          </p>
          <div className="space-y-4">
            <FormField label="Password Saat Ini">
              <input
                type="password"
                className={inputClass}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </FormField>
            <FormField label="Password Baru">
              <input
                type="password"
                className={inputClass}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </FormField>
            <FormField label="Konfirmasi Password Baru">
              <input
                type="password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </FormField>
          </div>
        </section>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />{" "}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
