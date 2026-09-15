export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 py-14 text-center text-sm font-medium text-ink-400">
      {message}
    </div>
  );
}
