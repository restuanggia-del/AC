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
import { teamApi, uploadImage } from "../services/resources";
import type { TeamMember } from "../types";

const emptyForm: Partial<TeamMember> = {
  name: "",
  position: "",
  photoUrl: "",
  description: "",
  socialLinks: { instagram: "", facebook: "" },
  isActive: true,
  order: 0,
};

export default function TeamPage() {
  const { showToast } = useToast();
  const { normalizedQuery } = useSearch();
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    teamApi
      .getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }
  useEffect(loadData, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        matchesQuery([item.name, item.position], normalizedQuery),
      ),
    [items, normalizedQuery],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function openEdit(item: TeamMember) {
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
      setForm((f) => ({ ...f, photoUrl: url }));
    } catch {
      showToast("Gagal mengunggah foto", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await teamApi.update(editing._id, form);
        showToast("Team berhasil diperbarui");
      } else {
        await teamApi.create(form);
        showToast("Team berhasil ditambahkan");
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
      await teamApi.remove(deleteTarget._id);
      showToast("Team berhasil dihapus");
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
        title="Team"
        description="Kelola profil teknisi & customer service."
        action={
          <button onClick={openCreate} className="clay-btn clay-btn-primary">
            <Plus className="h-4 w-4" /> Tambah Anggota
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && filteredItems.length === 0 && (
          <p className="text-sm text-ink-400">
            {items.length === 0
              ? "Belum ada data team."
              : "Tidak ada hasil yang cocok."}
          </p>
        )}
        {filteredItems.map((m) => (
          <div key={m._id} className="clay-card text-center">
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-ink-100">
              {m.photoUrl ? (
                <img
                  src={m.photoUrl}
                  alt={m.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <p className="mt-3 font-bold text-ink-900">{m.name}</p>
            <p className="text-xs font-semibold text-brand-600">{m.position}</p>
            <div className="mt-2 flex justify-center">
              <Badge active={m.isActive} />
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={() => openEdit(m)}
                className="clay-icon-btn clay-icon-btn-brand h-8 w-8"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(m)}
                className="clay-icon-btn clay-icon-btn-danger h-8 w-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Anggota" : "Tambah Anggota"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nama">
            <input
              required
              className={inputClass}
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Jabatan">
            <input
              required
              placeholder="Customer Service / Teknisi Senior"
              className={inputClass}
              value={form.position ?? ""}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </FormField>
          <FormField label="Foto">
            <div className="flex items-center gap-3">
              {form.photoUrl && (
                <img
                  src={form.photoUrl}
                  alt="preview"
                  className="clay-sm h-14 w-14 rounded-full object-cover"
                />
              )}
              <label className="clay-btn clay-btn-secondary cursor-pointer border-2 border-dashed border-ink-300/70">
                <Upload className="h-4 w-4" />{" "}
                {uploading ? "Mengunggah..." : "Unggah Foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>
          </FormField>
          <FormField label="Deskripsi Singkat">
            <textarea
              rows={2}
              className={inputClass}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Instagram (opsional)">
              <input
                className={inputClass}
                value={form.socialLinks?.instagram ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: {
                      ...form.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </FormField>
            <FormField label="Facebook (opsional)">
              <input
                className={inputClass}
                value={form.socialLinks?.facebook ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: {
                      ...form.socialLinks,
                      facebook: e.target.value,
                    },
                  })
                }
              />
            </FormField>
          </div>
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
            disabled={saving}
            className="clay-btn clay-btn-primary w-full"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Anggota?"
        description={`Data "${deleteTarget?.name}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
