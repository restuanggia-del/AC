import { X } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export default function Modal({ open, title, onClose, children, widthClass = "max-w-lg" }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm">
      <div className={`clay max-h-[90vh] w-full ${widthClass} overflow-y-auto !rounded-[28px]`}>
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-base font-extrabold text-ink-900">{title}</h3>
          <button onClick={onClose} className="clay-icon-btn clay-icon-btn-danger">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
