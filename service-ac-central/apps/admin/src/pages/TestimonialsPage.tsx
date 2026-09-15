import { Check, Pencil, Plus, Trash2, X as XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import RatingStars from "../components/RatingStars";
import { useToast } from "../components/Toast";
import { testimonialApi } from "../services/resources";
import type { Testimonial } from "../types";

const emptyForm: Partial<Testimonial> = { customerName: "", rating: 5, message: "", isPublished: true };

export default function TestimonialsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    testimonialApi.getAll().then(setItems).finally(() => setLoading(false));
  }
  useEffect(loadData, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(item: Testimonial) { setEditing(item); setForm(item); setModalOpen(true); }

  async function togglePublish(item: Testimonial) {
    try {
      await testimonialApi.update(item._id, { isPublished: !item.isPublished });
      showToast(item.isPublished ? "Testimoni disembunyikan" : "Testimoni dipublikasikan");
      loadData();
    } catch {
      showToast("Gagal memperbarui status", "error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await testimonialApi.update(editing._id, form); showToast("Testimoni berhasil diperbarui"); }
      else { await testimonialApi.create(form); showToast("Testimoni berhasil ditambahkan"); }
      setModalOpen(false);
      loadData();
    } catch {
      showToast("Gagal menyimpan data", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await testimonialApi.remove(deleteTarget._id);
      showToast("Testimoni berhasil dihapus");
      setDeleteTarget(null);
      loadData();
    } catch {
      showToast("Gagal menghapus data", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Testimoni"
        description="Kelola dan moderasi testimoni pelanggan sebelum tampil di website."
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Tambah Testimoni
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-ink-400">Belum ada testimoni.</p>}
        {items.map((t) => (
          <div key={t._id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <RatingStars rating={t.rating} />
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${t.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {t.isPublished ? "Terpublikasi" : "Menunggu"}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-600">&ldquo;{t.message}&rdquo;</p>
            <p className="mt-3 text-sm font-bold text-ink-900">{t.customerName}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => togglePublish(t)} title={t.isPublished ? "Sembunyikan" : "Publikasikan"} className={`rounded-lg p-2 ${t.isPublished ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}>
                {t.isPublished ? <XIcon className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(t)} className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleteTarget(t)} className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Testimoni" : "Tambah Testimoni"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Pelanggan">
            <input required className={inputClass} value={form.customerName ?? ""} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </FormField>
          <FormField label="Rating">
            <select className={inputClass} value={form.rating ?? 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Bintang</option>)}
            </select>
          </FormField>
          <FormField label="Isi Testimoni">
            <textarea required rows={3} className={inputClass} value={form.message ?? ""} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </FormField>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-600">
            <input type="checkbox" checked={form.isPublished ?? true} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Publikasikan ke website
          </label>
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Testimoni?"
        description={`Testimoni dari "${deleteTarget?.customerName}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
