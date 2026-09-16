import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, isLoading }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm">
      <div className="clay w-full max-w-sm p-6 !rounded-[28px]">
        <div className="clay-bubble h-12 w-12 bg-gradient-to-br from-rose-300 to-red-500 text-white">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="clay-btn clay-btn-secondary">
            Batal
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="clay-btn clay-btn-danger">
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
