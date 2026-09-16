import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { inputClass } from "./inputClass";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  withLeadingIcon?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  required,
  autoComplete,
  withLeadingIcon = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {withLeadingIcon && (
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      )}
      <input
        type={visible ? "text" : "password"}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${withLeadingIcon ? "pl-10" : ""} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-brand-600"
        aria-label={visible ? "Sembunyikan password" : "Lihat password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
