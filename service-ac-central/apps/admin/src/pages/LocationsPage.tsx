import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { locationApi } from "../services/resources";
import type { LocationArea } from "../types";

const emptyForm: Partial<LocationArea> = { areaName: "", mapEmbedUrl: "", description: "", isActive: true, order: 0 };

export default function LocationsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<LocationArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LocationArea | null>(null);
  const [form, setForm] = useState<Partial<LocationArea>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LocationArea | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    locationApi.getAll().then(setItems).finally(() => setLoading(false));
  }
  useEffect(loadData, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(item: LocationArea) { setEditing(item); setForm(item); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await locationApi.update(editing._id, form); showToast("Lokasi berhasil diperbarui"); }
      else { await locationApi.create(form); showToast("Lokasi berhasil ditambahkan"); }
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
      await locationApi.remove(deleteTarget._id);
      showToast("Lokasi berhasil dihapus");
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
        title="Lokasi"
        description="Kelola area layanan yang tampil di website publik."
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Tambah Lokasi
          </button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-ink-50 text-ink-500">
            <tr>
              <th className="px-4 py-3 font-bold">Nama Area</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading && <tr><td colSpan={3} className="px-4 py-8 text-center text-ink-400">Memuat data...</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-ink-400">Belum ada data lokasi.</td></tr>}
            {items.map((loc) => (
              <tr key={loc._id} className="hover:bg-ink-50">
                <td className="px-4 py-3 font-semibold text-ink-800">{loc.areaName}</td>
                <td className="px-4 py-3"><Badge active={loc.isActive} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(loc)} className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(loc)} className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Lokasi" : "Tambah Lokasi"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Area">
            <input required placeholder="Jakarta Selatan" className={inputClass} value={form.areaName ?? ""} onChange={(e) => setForm({ ...form, areaName: e.target.value })} />
          </FormField>
          <FormField label="Link Embed Google Maps" hint="Buka Google Maps > Bagikan > Sematkan peta > salin URL src dari kode iframe.">
            <input required className={inputClass} value={form.mapEmbedUrl ?? ""} onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })} />
          </FormField>
          <FormField label="Deskripsi (opsional)">
            <textarea rows={2} className={inputClass} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-600">
            <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Aktif
          </label>
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Lokasi?"
        description={`Data "${deleteTarget?.areaName}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
