interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DonutDatum[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
}

export default function DonutChart({
  data,
  size = 140,
  strokeWidth = 18,
  centerLabel,
}: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(163,177,208,0.25)"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            data.map((d, i) => {
              if (d.value === 0) return null;
              const fraction = d.value / total;
              const dash = fraction * circumference;
              const gap = circumference - dash;
              const dashoffset = -offsetAcc;
              offsetAcc += dash;
              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="butt"
                />
              );
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-extrabold text-ink-900">{total}</p>
          {centerLabel && (
            <p className="text-[10px] font-semibold text-ink-400">
              {centerLabel}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 font-semibold text-ink-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.label}
            </span>
            <span className="font-bold text-ink-900">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
