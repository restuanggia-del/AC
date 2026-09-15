import { Pencil, Plus, Trash2, X as XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { packageApi } from "../services/resources";
import type { ChecklistItem, PricePackage } from "../types";

const emptyForm: Partial<PricePackage> = {
  name: "",
  pkSize: "",
  price: 0,
  checklist: [],
  isActive: true,
  order: 0,
};

export default function PackagesPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<PricePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PricePackage | null>(null);
  const [form, setForm] = useState<Partial<PricePackage>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PricePackage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [checklistDraft, setChecklistDraft] = useState("");

  function loadData() {
    setLoading(true);
    packageApi.getAll().then(setItems).finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: PricePackage) {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  }

  function addChecklistItem() {
    if (!checklistDraft.trim()) return;
    const next: ChecklistItem[] = [...(form.checklist ?? []), { item: checklistDraft.trim(), included: true }];
    setForm({ ...form, checklist: next });
    setChecklistDraft("");
  }

  function removeChecklistItem(index: number) {
    const next = (form.checklist ?? []).filter((_, i) => i !== index);
    setForm({ ...form, checklist: next });
  }

  function toggleChecklistItem(index: number) {
    const next = (form.checklist ?? []).map((c, i) => (i === index ? { ...c, included: !c.included } : c));
    setForm({ ...form, checklist: next });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await packageApi.update(editing._id, form);
        showToast("Paket berhasil diperbarui");
      } else {
        await packageApi.create(form);
        showToast("Paket berhasil ditambahkan");
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
      await packageApi.remove(deleteTarget._id);
      showToast("Paket berhasil dihapus");
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
        title="Paket Harga"
        description="Kelola paket harga lengkap dengan rincian item pekerjaan."
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Tambah Paket
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-ink-400">Belum ada paket harga.</p>}
        {items.map((pkg) => (
          <div key={pkg._id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-brand-600">{pkg.pkSize}</p>
                <p className="font-bold text-ink-900">{pkg.name}</p>
              </div>
              <Badge active={pkg.isActive} />
            </div>
            <p className="mt-2 text-lg font-extrabold text-ink-900">Rp {pkg.price.toLocaleString("id-ID")}</p>
            <ul className="mt-3 space-y-1 text-xs text-ink-500">
              {pkg.checklist.slice(0, 3).map((c, i) => (
                <li key={i}>• {c.item}</li>
              ))}
              {pkg.checklist.length > 3 && <li>+{pkg.checklist.length - 3} item lainnya</li>}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => openEdit(pkg)} className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleteTarget(pkg)} className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Paket" : "Tambah Paket"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama Paket">
            <input required className={inputClass} value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ukuran PK">
              <input required placeholder="0.5 - 1 PK" className={inputClass} value={form.pkSize ?? ""} onChange={(e) => setForm({ ...form, pkSize: e.target.value })} />
            </FormField>
            <FormField label="Harga (Rp)">
              <input required type="number" min={0} className={inputClass} value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </FormField>
          </div>

          <FormField label="Checklist Item Pekerjaan">
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Contoh: Cuci evaporator & kondensor"
                value={checklistDraft}
                onChange={(e) => setChecklistDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChecklistItem(); } }}
              />
              <button type="button" onClick={addChecklistItem} className="rounded-xl bg-ink-900 px-4 text-sm font-bold text-white hover:bg-brand-600">
                Tambah
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {(form.checklist ?? []).map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2">
                  <input type="checkbox" checked={c.included} onChange={() => toggleChecklistItem(i)} />
                  <span className={`flex-1 text-sm ${c.included ? "text-ink-700" : "text-ink-400 line-through"}`}>{c.item}</span>
                  <button type="button" onClick={() => removeChecklistItem(i)} className="text-ink-400 hover:text-red-600">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </FormField>

          <div className="flex items-center justify-between">
            <FormField label="Urutan Tampil">
              <input type="number" className={inputClass} value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </FormField>
            <label className="flex items-center gap-2 pt-6 text-sm font-semibold text-ink-600">
              <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Aktif
            </label>
          </div>

          <button type="submit" disabled={saving} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Paket?"
        description={`Paket "${deleteTarget?.name}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
