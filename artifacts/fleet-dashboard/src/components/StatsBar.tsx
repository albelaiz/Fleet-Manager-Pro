import React from "react";
import { Card } from "./ui/card";
import { Car } from "../data/types";
import { Car as CarIcon, CheckCircle2, Key, Wrench, AlertTriangle } from "lucide-react";
import { getCarHealthScore } from "../lib/maintenance";

export function StatsBar({ cars }: { cars: Car[] }) {
  const total = cars.length;
  const available = cars.filter(c => c.status === "Available").length;
  const rented = cars.filter(c => c.status === "Rented").length;
  const maintenance = cars.filter(c => c.status === "Maintenance").length;
  
  let alerts = 0;
  cars.forEach(car => {
    const health = getCarHealthScore(car);
    alerts += health.metrics.filter(m => m.severity === "critical" || m.severity === "warning").length;
  });

  const stats = [
    { label: "Total Fleet", value: total, icon: CarIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Available", value: available, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "On Rent", value: rented, icon: Key, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "In Shop", value: maintenance, icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Alerts", value: alerts, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((s, i) => (
        <Card key={i} className="p-4 flex items-center gap-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors border-muted">
          <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
