import { useCars } from "../context/CarsContext";
import { getCarHealth } from "../lib/maintenance";

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

  const stats = [
    { label: "Total Fleet", value: total },
    { label: "Available", value: available },
    { label: "On Rent", value: rented },
    { label: "Alerts", value: alerts },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="p-6 border bg-card rounded-xl shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
            {s.label}
          </p>
          <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
