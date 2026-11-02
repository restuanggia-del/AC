interface BarDatum {
  label: string;
  value: number;
}

interface Props {
  data: BarDatum[];
  height?: number;
  colorFrom?: string;
  colorTo?: string;
  valueSuffix?: string;
}

export default function BarChart({
  data,
  height = 160,
  colorFrom = "#4fa2ff",
  colorTo = "#1361ea",
  valueSuffix = "",
}: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-2.5">
        {data.map((d, i) => {
          const pct = d.value === 0 ? 4 : Math.max((d.value / max) * 100, 4);
          return (
            <div
              key={i}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
            >
              <p className="text-[11px] font-bold text-ink-600">
                {d.value}
                {valueSuffix}
              </p>
              <div className="relative min-h-0 w-full flex-1">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-[10px] rounded-b-[4px]"
                  style={{
                    height: `${pct}%`,
                    background: `linear-gradient(to top, ${colorFrom}, ${colorTo})`,
                  }}
                />
              </div>
              <p className="text-[11px] font-semibold text-ink-400">
                {d.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
