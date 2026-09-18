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
  const gradientId = `bar-grad-${colorFrom.replace("#", "")}-${colorTo.replace("#", "")}`;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-2.5">
        {data.map((d, i) => {
          const pct = d.value === 0 ? 0.04 : d.value / max;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              <p className="text-[11px] font-bold text-ink-600">
                {d.value}
                {valueSuffix}
              </p>
              <div className="flex w-full flex-1 items-end">
                <svg
                  viewBox="0 0 10 100"
                  preserveAspectRatio="none"
                  className="w-full"
                  style={{ height: `${Math.max(pct * 100, 4)}%` }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor={colorFrom} />
                      <stop offset="100%" stopColor={colorTo} />
                    </linearGradient>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="10"
                    height="100"
                    rx="3"
                    fill={`url(#${gradientId})`}
                  />
                </svg>
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
