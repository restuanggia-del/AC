const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const monthLabels = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  markers?: Record<string, number>;
}

export default function MiniCalendar({ markers = {} }: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <p className="mb-3 text-center text-sm font-extrabold text-ink-900">
        {monthLabels[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayLabels.map((d) => (
          <p
            key={d}
            className="py-1 text-[10px] font-bold uppercase tracking-wide text-ink-400"
          >
            {d}
          </p>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateKey = toDateKey(new Date(year, month, day));
          const isToday = day === today.getDate();
          const count = markers[dateKey] ?? 0;
          return (
            <div
              key={day}
              title={count > 0 ? `${count} pesan masuk` : undefined}
              className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-semibold ${
                isToday
                  ? "clay-chip-active !rounded-lg text-white"
                  : count > 0
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-500"
              }`}
            >
              {day}
              {count > 0 && !isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
