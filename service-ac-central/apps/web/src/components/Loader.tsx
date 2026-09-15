export default function Loader({
  label = "Memuat data...",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
