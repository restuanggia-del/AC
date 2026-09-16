export default function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={`clay-chip ${
        active
          ? "bg-gradient-to-br from-emerald-300 to-emerald-500 text-white shadow-[3px_3px_10px_rgba(16,185,129,0.35),-3px_-3px_6px_rgba(255,255,255,0.6)]"
          : "clay-chip-idle"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}
