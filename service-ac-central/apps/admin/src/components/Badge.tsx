export default function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-500"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}
