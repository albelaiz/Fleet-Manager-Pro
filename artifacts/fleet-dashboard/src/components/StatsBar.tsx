import { useMemo } from "react";
import { useCars } from "../context/CarsContext";
import { getCarHealth } from "../lib/maintenance";
import { Sparkline } from "./Sparkline";

// Deterministic pseudo-random based on seed to keep data stable across renders
function seededSeries(seed: number, length = 7, base = 0, jitter = 5) {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < length; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    out.push(Math.max(0, Math.round(base + r * jitter)));
  }
  return out;
}

export function StatsBar() {
  const { cars } = useCars();

  const total = cars.length;
  const available = cars.filter((c) => c.status === "Available").length;
  const rented = cars.filter((c) => c.status === "Rented").length;

  let alerts = 0;
  cars.forEach((car) => {
    const h = getCarHealth(car);
    alerts += h.criticalCount + h.warningCount;
  });

  const series = useMemo(() => {
    const base = total;
    return {
      total: [
        ...seededSeries(11, 6, Math.max(0, base - 3), 3),
        base,
      ],
      available: [
        ...seededSeries(23, 6, Math.max(0, available - 2), 4),
        available,
      ],
      rented: [
        ...seededSeries(47, 6, Math.max(0, rented - 1), 3),
        rented,
      ],
      alerts: [
        ...seededSeries(91, 6, Math.max(0, alerts - 2), 4),
        alerts,
      ],
    };
  }, [total, available, rented, alerts]);

  const stats = [
    {
      label: "Total Fleet",
      value: total,
      values: series.total,
      color: "hsl(217 91% 65%)",
    },
    {
      label: "Available",
      value: available,
      values: series.available,
      color: "hsl(160 70% 55%)",
    },
    {
      label: "On Rent",
      value: rented,
      values: series.rented,
      color: "hsl(258 85% 70%)",
    },
    {
      label: "Alerts",
      value: alerts,
      values: series.alerts,
      color: "hsl(0 80% 65%)",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="card-glass rounded-xl p-5 flex items-end justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium mb-3">
              {s.label}
            </p>
            <p className="text-3xl font-light tabular-nums tracking-tight leading-none">
              {s.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 tabular-nums">
              7-day density
            </p>
          </div>
          <div className="shrink-0 -mr-1">
            <Sparkline values={s.values} color={s.color} />
          </div>
        </div>
      ))}
    </div>
  );
}
