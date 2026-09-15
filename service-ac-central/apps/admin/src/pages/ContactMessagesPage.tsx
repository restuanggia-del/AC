import { Archive, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { contactApi } from "../services/resources";
import type { ContactMessage } from "../types";

const statusLabel: Record<ContactMessage["status"], string> = {
  new: "Baru",
  read: "Dibaca",
  archived: "Diarsipkan",
};

const statusColor: Record<ContactMessage["status"], string> = {
  new: "bg-brand-50 text-brand-700",
  read: "bg-ink-100 text-ink-500",
  archived: "bg-amber-50 text-amber-700",
};

export default function ContactMessagesPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    contactApi.getAll(filter || undefined).then(setItems).finally(() => setLoading(false));
  }
  useEffect(loadData, [filter]);

  async function markAsRead(item: ContactMessage) {
    if (item.status !== "new") return;
    await contactApi.updateStatus(item._id, "read");
    loadData();
  }

  async function archive(item: ContactMessage) {
    await contactApi.updateStatus(item._id, "archived");
    showToast("Pesan diarsipkan");
    loadData();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contactApi.remove(deleteTarget._id);
      showToast("Pesan berhasil dihapus");
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
      <PageHeader title="Pesan Masuk" description="Pesan yang dikirim pelanggan melalui form kontak website." />

      <div className="mb-4 flex gap-2">
        {["", "new", "read", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${filter === s ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600"}`}
          >
            {s === "" ? "Semua" : statusLabel[s as ContactMessage["status"]]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-ink-400">Belum ada pesan masuk.</p>}
        {items.map((msg) => (
          <div key={msg._id} onClick={() => markAsRead(msg)} className="cursor-pointer rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-ink-900">{msg.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusColor[msg.status]}`}>{statusLabel[msg.status]}</span>
                </div>
                <p className="text-xs text-ink-400">{msg.phone} {msg.email ? `• ${msg.email}` : ""}</p>
                <p className="mt-2 text-sm text-ink-600">{msg.message}</p>
                <p className="mt-2 text-xs text-ink-400">{new Date(msg.createdAt).toLocaleString("id-ID")}</p>
              </div>
              <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
                {msg.status !== "archived" && (
                  <button onClick={() => archive(msg)} title="Arsipkan" className="rounded-lg p-2 text-ink-500 hover:bg-amber-50 hover:text-amber-600">
                    <Archive className="h-4 w-4" />
                  </button>
                )}
                {msg.status === "new" && (
                  <button onClick={() => markAsRead(msg)} title="Tandai dibaca" className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700">
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => setDeleteTarget(msg)} title="Hapus" className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Pesan?"
        description={`Pesan dari "${deleteTarget?.name}" akan dihapus permanen.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
