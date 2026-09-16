import { Check, Pencil, Plus, Trash2, X as XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import RatingStars from "../components/RatingStars";
import { useToast } from "../components/Toast";
import { matchesQuery, useSearch } from "../hooks/useSearch";
import { testimonialApi } from "../services/resources";
import type { Testimonial } from "../types";

const emptyForm: Partial<Testimonial> = {
  customerName: "",
  rating: 5,
  message: "",
  isPublished: true,
};

export default function TestimonialsPage() {
  const { showToast } = useToast();
  const { normalizedQuery } = useSearch();
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
    testimonialApi
      .getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }
  useEffect(loadData, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        matchesQuery([item.customerName, item.message], normalizedQuery),
      ),
    [items, normalizedQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function openEdit(item: Testimonial) {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  }

  async function togglePublish(item: Testimonial) {
    try {
      await testimonialApi.update(item._id, { isPublished: !item.isPublished });
      showToast(
        item.isPublished
          ? "Testimoni disembunyikan"
          : "Testimoni dipublikasikan",
      );
      loadData();
    } catch {
      showToast("Gagal memperbarui status", "error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await testimonialApi.update(editing._id, form);
        showToast("Testimoni berhasil diperbarui");
      } else {
        await testimonialApi.create(form);
        showToast("Testimoni berhasil ditambahkan");
      }
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
          <button onClick={openCreate} className="clay-btn clay-btn-primary">
            <Plus className="h-4 w-4" /> Tambah Testimoni
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && filteredItems.length === 0 && (
          <p className="text-sm text-ink-400">
            {items.length === 0
              ? "Belum ada testimoni."
              : "Tidak ada hasil yang cocok."}
          </p>
        )}
        {filteredItems.map((t) => (
          <div key={t._id} className="clay-card">
            <div className="flex items-start justify-between">
              <RatingStars rating={t.rating} />
              <span
                className={`clay-chip ${t.isPublished ? "bg-gradient-to-br from-emerald-300 to-emerald-500 text-white shadow-[3px_3px_10px_rgba(16,185,129,0.35),-3px_-3px_6px_rgba(255,255,255,0.6)]" : "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-[3px_3px_10px_rgba(217,119,6,0.3),-3px_-3px_6px_rgba(255,255,255,0.6)]"}`}
              >
                {t.isPublished ? "Terpublikasi" : "Menunggu"}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-600">
              &ldquo;{t.message}&rdquo;
            </p>
            <p className="mt-3 text-sm font-bold text-ink-900">
              {t.customerName}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => togglePublish(t)}
                title={t.isPublished ? "Sembunyikan" : "Publikasikan"}
                className={`clay-icon-btn ${t.isPublished ? "clay-icon-btn-amber" : "clay-icon-btn-emerald"}`}
              >
                {t.isPublished ? (
                  <XIcon className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => openEdit(t)}
                className="clay-icon-btn clay-icon-btn-brand"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(t)}
                className="clay-icon-btn clay-icon-btn-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Testimoni" : "Tambah Testimoni"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Pelanggan">
            <input
              required
              className={inputClass}
              value={form.customerName ?? ""}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </FormField>
          <FormField label="Rating">
            <select
              className={inputClass}
              value={form.rating ?? 5}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Bintang
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Isi Testimoni">
            <textarea
              required
              rows={3}
              className={inputClass}
              value={form.message ?? ""}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-600">
            <input
              type="checkbox"
              checked={form.isPublished ?? true}
              onChange={(e) =>
                setForm({ ...form, isPublished: e.target.checked })
              }
            />
            Publikasikan ke website
          </label>
          <button
            type="submit"
            disabled={saving}
            className="clay-btn clay-btn-primary w-full"
          >
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
