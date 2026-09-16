import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { matchesQuery, useSearch } from "../hooks/useSearch";
import { faqApi } from "../services/resources";
import type { FAQItem } from "../types";

const emptyForm: Partial<FAQItem> = {
  question: "",
  answer: "",
  order: 0,
  isActive: true,
};

export default function FaqPage() {
  const { showToast } = useToast();
  const { normalizedQuery } = useSearch();
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [form, setForm] = useState<Partial<FAQItem>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    faqApi
      .getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }
  useEffect(loadData, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        matchesQuery([item.question, item.answer], normalizedQuery),
      ),
    [items, normalizedQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function openEdit(item: FAQItem) {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await faqApi.update(editing._id, form);
        showToast("FAQ berhasil diperbarui");
      } else {
        await faqApi.create(form);
        showToast("FAQ berhasil ditambahkan");
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
      await faqApi.remove(deleteTarget._id);
      showToast("FAQ berhasil dihapus");
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
        title="FAQ"
        description="Kelola pertanyaan yang sering diajukan pelanggan."
        action={
          <button onClick={openCreate} className="clay-btn clay-btn-primary">
            <Plus className="h-4 w-4" /> Tambah FAQ
          </button>
        }
      />

      <div className="space-y-3">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && filteredItems.length === 0 && (
          <p className="text-sm text-ink-400">
            {items.length === 0
              ? "Belum ada data FAQ."
              : "Tidak ada hasil yang cocok."}
          </p>
        )}
        {filteredItems.map((f) => (
          <div key={f._id} className="clay-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-ink-900">{f.question}</p>
                <p className="mt-1 text-sm text-ink-500">{f.answer}</p>
              </div>
              <Badge active={f.isActive} />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => openEdit(f)}
                className="clay-icon-btn clay-icon-btn-brand"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(f)}
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
        title={editing ? "Edit FAQ" : "Tambah FAQ"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Pertanyaan">
            <input
              required
              className={inputClass}
              value={form.question ?? ""}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </FormField>
          <FormField label="Jawaban">
            <textarea
              required
              rows={3}
              className={inputClass}
              value={form.answer ?? ""}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
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
        title="Hapus FAQ?"
        description="Pertanyaan ini akan dihapus permanen."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
