import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { settingsApi } from "../services/resources";
import type { SiteSettings, Stat } from "../types";

const emptySettings: Partial<SiteSettings> = {
  companyName: "",
  tagline: "",
  whatsappNumber: "",
  phoneNumber: "",
  email: "",
  address: "",
  operationalHours: "",
  heroTitle: "",
  heroSubtitle: "",
  socialLinks: {},
  stats: [],
};

export default function SettingsPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<Partial<SiteSettings>>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statDraft, setStatDraft] = useState<Stat>({ label: "", value: 0 });

  useEffect(() => {
    settingsApi
      .get()
      .then(setForm)
      .finally(() => setLoading(false));
  }, []);

  function addStat() {
    if (!statDraft.label.trim()) return;
    setForm((f) => ({ ...f, stats: [...(f.stats ?? []), statDraft] }));
    setStatDraft({ label: "", value: 0 });
  }

  function removeStat(index: number) {
    setForm((f) => ({ ...f, stats: (f.stats ?? []).filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await settingsApi.update(form);
      setForm(updated);
      showToast("Pengaturan berhasil disimpan");
    } catch {
      showToast("Gagal menyimpan pengaturan", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-400">Memuat pengaturan...</p>;
  }

  return (
    <div>
      <PageHeader title="Pengaturan Umum" description="Informasi ini tampil di seluruh halaman website publik." />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-ink-900">Identitas Perusahaan</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nama Perusahaan">
              <input className={inputClass} value={form.companyName ?? ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </FormField>
            <FormField label="Tagline">
              <input className={inputClass} value={form.tagline ?? ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </FormField>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-ink-900">Kontak</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nomor WhatsApp" hint="Format internasional tanpa tanda +, contoh: 6281234567890">
              <input className={inputClass} value={form.whatsappNumber ?? ""} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
            </FormField>
            <FormField label="Nomor Telepon">
              <input className={inputClass} value={form.phoneNumber ?? ""} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <input className={inputClass} value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormField>
            <FormField label="Jam Operasional">
              <input className={inputClass} value={form.operationalHours ?? ""} onChange={(e) => setForm({ ...form, operationalHours: e.target.value })} />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Alamat">
              <textarea rows={2} className={inputClass} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </FormField>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-ink-900">Media Sosial (opsional)</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Instagram">
              <input className={inputClass} value={form.socialLinks?.instagram ?? ""} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
            </FormField>
            <FormField label="Facebook">
              <input className={inputClass} value={form.socialLinks?.facebook ?? ""} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} />
            </FormField>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-ink-900">Konten Hero (Beranda)</p>
          <FormField label="Judul Hero">
            <input className={inputClass} value={form.heroTitle ?? ""} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
          </FormField>
          <div className="mt-4">
            <FormField label="Subjudul Hero">
              <textarea rows={2} className={inputClass} value={form.heroSubtitle ?? ""} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
            </FormField>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-ink-900">Statistik Pencapaian</p>
          <div className="flex gap-2">
            <input placeholder="Label, contoh: Klien Puas" className={inputClass} value={statDraft.label} onChange={(e) => setStatDraft({ ...statDraft, label: e.target.value })} />
            <input type="number" placeholder="Angka" className={`${inputClass} w-32`} value={statDraft.value} onChange={(e) => setStatDraft({ ...statDraft, value: Number(e.target.value) })} />
            <button type="button" onClick={addStat} className="inline-flex items-center gap-1 rounded-xl bg-ink-900 px-4 text-sm font-bold text-white hover:bg-brand-600">
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {(form.stats ?? []).map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2">
                <p className="text-sm text-ink-700">{s.label} — <span className="font-bold">{s.value}+</span></p>
                <button type="button" onClick={() => removeStat(i)} className="text-ink-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}
