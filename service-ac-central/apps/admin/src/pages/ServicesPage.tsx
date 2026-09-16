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
import { serviceApi, uploadImage } from "../services/resources";
import type { Service } from "../types";

const categoryOptions = [
  { value: "cuci", label: "Cuci AC" },
  { value: "service", label: "Service AC" },
  { value: "pasang", label: "Pasang AC" },
  { value: "bongkar", label: "Bongkar AC" },
  { value: "freon", label: "Freon" },
  { value: "sparepart", label: "Sparepart" },
  { value: "lainnya", label: "Lainnya" },
];

const emptyForm: Partial<Service> = {
  name: "",
  category: "cuci",
  pkSize: "",
  price: 0,
  description: "",
  imageUrl: "",
  isActive: true,
  order: 0,
};

export default function ServicesPage() {
  const { showToast } = useToast();
  const { normalizedQuery } = useSearch();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    serviceApi
      .getAll()
      .then(setItems)
      .catch(() => showToast("Gagal memuat data layanan", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        matchesQuery([item.name, item.category, item.pkSize], normalizedQuery),
      ),
    [items, normalizedQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: Service) {
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
        await serviceApi.update(editing._id, form);
        showToast("Layanan berhasil diperbarui");
      } else {
        await serviceApi.create(form);
        showToast("Layanan berhasil ditambahkan");
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
      await serviceApi.remove(deleteTarget._id);
      showToast("Layanan berhasil dihapus");
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
        title="Layanan"
        description="Kelola daftar layanan AC yang tampil di website publik."
        action={
          <button onClick={openCreate} className="clay-btn clay-btn-primary">
            <Plus className="h-4 w-4" /> Tambah Layanan
          </button>
        }
      />

      <div className="clay-card-flush overflow-x-auto">
        <table className="clay-table w-full min-w-[720px] text-left text-sm">
          <thead className="text-ink-500">
            <tr>
              <th className="px-4 py-3 font-bold">Nama Layanan</th>
              <th className="px-4 py-3 font-bold">Kategori</th>
              <th className="px-4 py-3 font-bold">Ukuran</th>
              <th className="px-4 py-3 font-bold">Harga</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-400">
                  Memuat data...
                </td>
              </tr>
            )}
            {!loading && filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-400">
                  {items.length === 0
                    ? "Belum ada data layanan."
                    : "Tidak ada hasil yang cocok."}
                </td>
              </tr>
            )}
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-3 font-semibold text-ink-800">
                  {item.name}
                </td>
                <td className="px-4 py-3 capitalize text-ink-500">
                  {item.category}
                </td>
                <td className="px-4 py-3 text-ink-500">{item.pkSize}</td>
                <td className="px-4 py-3 font-semibold text-ink-800">
                  Rp {item.price.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <Badge active={item.isActive} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="clay-icon-btn clay-icon-btn-brand"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="clay-icon-btn clay-icon-btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Layanan" : "Tambah Layanan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Layanan">
            <input
              required
              className={inputClass}
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kategori">
              <select
                className={inputClass}
                value={form.category ?? "cuci"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Service["category"],
                  })
                }
              >
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Ukuran PK">
              <input
                required
                placeholder="0.5 - 1 PK"
                className={inputClass}
                value={form.pkSize ?? ""}
                onChange={(e) => setForm({ ...form, pkSize: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Harga (Rp)">
            <input
              required
              type="number"
              min={0}
              className={inputClass}
              value={form.price ?? 0}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </FormField>

          <FormField label="Deskripsi">
            <textarea
              rows={3}
              className={inputClass}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>

          <FormField label="Gambar Layanan">
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

          <div className="flex items-center justify-between">
            <FormField label="Urutan Tampil">
              <input
                type="number"
                className={inputClass}
                value={form.order ?? 0}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </FormField>
            <label className="flex items-center gap-2 pt-6 text-sm font-semibold text-ink-600">
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Aktif
            </label>
          </div>

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
        title="Hapus Layanan?"
        description={`Data "${deleteTarget?.name}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
