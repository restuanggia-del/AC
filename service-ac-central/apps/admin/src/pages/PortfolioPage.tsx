import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { matchesQuery, useSearch } from "../hooks/useSearch";
import { portfolioApi, uploadImage } from "../services/resources";
import type { Portfolio } from "../types";

const emptyForm: Partial<Portfolio> = {
  title: "",
  category: "service",
  imageUrl: "",
  description: "",
  isActive: true,
};

export default function PortfolioPage() {
  const { showToast } = useToast();
  const { normalizedQuery } = useSearch();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState<Partial<Portfolio>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Portfolio | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    portfolioApi
      .getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }
  useEffect(loadData, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        matchesQuery([item.title, item.category], normalizedQuery),
      ),
    [items, normalizedQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function openEdit(item: Portfolio) {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      showToast("Gagal mengunggah gambar", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await portfolioApi.update(editing._id, form);
        showToast("Portfolio berhasil diperbarui");
      } else {
        await portfolioApi.create(form);
        showToast("Portfolio berhasil ditambahkan");
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
      await portfolioApi.remove(deleteTarget._id);
      showToast("Portfolio berhasil dihapus");
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
        title="Portfolio"
        description="Kelola galeri hasil kerja teknisi."
        action={
          <button onClick={openCreate} className="clay-btn clay-btn-primary">
            <Plus className="h-4 w-4" /> Tambah Portfolio
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && filteredItems.length === 0 && (
          <p className="text-sm text-ink-400">
            {items.length === 0
              ? "Belum ada data portfolio."
              : "Tidak ada hasil yang cocok."}
          </p>
        )}
        {filteredItems.map((item) => (
          <div key={item._id} className="clay-card-flush">
            <div className="aspect-square w-full bg-ink-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-bold text-ink-800">
                {item.title}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs capitalize text-ink-400">
                  {item.category}
                </span>
                <Badge active={item.isActive} />
              </div>
              <div className="mt-2 flex justify-end gap-1">
                <button
                  onClick={() => openEdit(item)}
                  className="clay-icon-btn clay-icon-btn-brand h-8 w-8"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="clay-icon-btn clay-icon-btn-danger h-8 w-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Portfolio" : "Tambah Portfolio"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Judul">
            <input
              required
              className={inputClass}
              value={form.title ?? ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <FormField label="Kategori">
            <select
              className={inputClass}
              value={form.category ?? "service"}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as Portfolio["category"],
                })
              }
            >
              <option value="service">Service</option>
              <option value="cuci">Cuci</option>
              <option value="pasang">Pasang</option>
            </select>
          </FormField>
          <FormField label="Gambar">
            <div className="flex items-center gap-3">
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="clay-sm h-14 w-14 object-cover"
                />
              )}
              <label className="clay-btn clay-btn-secondary cursor-pointer border-2 border-dashed border-ink-300/70">
                <Upload className="h-4 w-4" />{" "}
                {uploading ? "Mengunggah..." : "Unggah Gambar"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>
          </FormField>
          <FormField label="Deskripsi (opsional)">
            <textarea
              rows={3}
              className={inputClass}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-600">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Aktif
          </label>
          <button
            type="submit"
            disabled={saving || !form.imageUrl}
            className="clay-btn clay-btn-primary w-full"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Portfolio?"
        description={`Data "${deleteTarget?.title}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
