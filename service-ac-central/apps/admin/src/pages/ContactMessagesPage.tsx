import { Archive, Eye, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { matchesQuery, useSearch } from "../hooks/useSearch";
import { contactApi } from "../services/resources";
import type { ContactMessage } from "../types";

const statusLabel: Record<ContactMessage["status"], string> = {
  new: "Baru",
  read: "Dibaca",
  archived: "Diarsipkan",
};

const statusColor: Record<ContactMessage["status"], string> = {
  new: "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[3px_3px_10px_rgba(19,97,234,0.3),-3px_-3px_6px_rgba(255,255,255,0.6)]",
  read: "clay-chip-idle",
  archived:
    "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-[3px_3px_10px_rgba(217,119,6,0.3),-3px_-3px_6px_rgba(255,255,255,0.6)]",
};

export default function ContactMessagesPage() {
  const { showToast } = useToast();
  const { normalizedQuery } = useSearch();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    contactApi
      .getAll(filter || undefined)
      .then(setItems)
      .finally(() => setLoading(false));
  }
  useEffect(loadData, [filter]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        matchesQuery(
          [item.name, item.phone, item.email, item.message],
          normalizedQuery,
        ),
      ),
    [items, normalizedQuery],
  );

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
      <PageHeader
        title="Pesan Masuk"
        description="Pesan yang dikirim pelanggan melalui form kontak website."
      />

      <div className="mb-4 flex gap-2">
        {["", "new", "read", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`clay-chip ${filter === s ? "clay-chip-active" : "clay-chip-idle"}`}
          >
            {s === "" ? "Semua" : statusLabel[s as ContactMessage["status"]]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm text-ink-400">Memuat data...</p>}
        {!loading && filteredItems.length === 0 && (
          <p className="text-sm text-ink-400">
            {items.length === 0
              ? "Belum ada pesan masuk."
              : "Tidak ada hasil yang cocok."}
          </p>
        )}
        {filteredItems.map((msg) => (
          <div
            key={msg._id}
            onClick={() => markAsRead(msg)}
            className="clay-card cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-ink-900">{msg.name}</p>
                  <span className={`clay-chip ${statusColor[msg.status]}`}>
                    {statusLabel[msg.status]}
                  </span>
                </div>
                <p className="text-xs text-ink-400">
                  {msg.phone} {msg.email ? `• ${msg.email}` : ""}
                </p>
                <p className="mt-2 text-sm text-ink-600">{msg.message}</p>
                <p className="mt-2 text-xs text-ink-400">
                  {new Date(msg.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
              <div
                className="flex shrink-0 gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {msg.status !== "archived" && (
                  <button
                    onClick={() => archive(msg)}
                    title="Arsipkan"
                    className="clay-icon-btn clay-icon-btn-amber"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                )}
                {msg.status === "new" && (
                  <button
                    onClick={() => markAsRead(msg)}
                    title="Tandai dibaca"
                    className="clay-icon-btn clay-icon-btn-brand"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(msg)}
                  title="Hapus"
                  className="clay-icon-btn clay-icon-btn-danger"
                >
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
