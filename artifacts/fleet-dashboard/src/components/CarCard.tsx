import React from "react";
import { Car } from "../data/types";
import { getCarHealthScore, HealthMetric } from "../lib/maintenance";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Droplet, CircleDashed, ShieldAlert, Calendar } from "lucide-react";
import { RentalCountdown } from "./RentalCountdown";
import { format } from "date-fns";
import { Link } from "wouter";

export function HealthBadge({ metric }: { metric: HealthMetric }) {
  const colors = {
    healthy: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    critical: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  const Icon = metric.type === "oil" ? Droplet : metric.type === "tire" ? CircleDashed : ShieldAlert;

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-md border ${colors[metric.severity]} bg-background/50`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{metric.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold">{metric.value}</span>
        {metric.severity !== "healthy" && (
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${metric.severity === "critical" ? "bg-red-400" : "bg-yellow-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${metric.severity === "critical" ? "bg-red-500" : "bg-yellow-500"}`}></span>
          </span>
        )}
      </div>
    </div>
  );
}

export function CarCard({ car }: { car: Car }) {
  const health = getCarHealthScore(car);
  
  const statusColors = {
    Available: "bg-green-500/10 text-green-500 border-green-500/20",
    Rented: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Maintenance: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors duration-200 group bg-card/50 backdrop-blur-sm">
      <div className="p-4 border-b bg-muted/20 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{car.brand} {car.model}</h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{car.plate} • {car.year}</p>
        </div>
        <Badge variant="outline" className={statusColors[car.status]}>
          {car.status}
        </Badge>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {car.status === "Rented" && car.currentRental && (
          <div className="bg-muted/30 rounded-lg p-3 border">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium">{car.currentRental.renter.name}</div>
              <RentalCountdown endDate={car.currentRental.endDate} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(car.currentRental.startDate), "MMM d")} → {format(new Date(car.currentRental.endDate), "MMM d, yyyy")}</span>
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2">
          {health.metrics.map(m => (
            <HealthBadge key={m.type} metric={m} />
          ))}
        </div>
      </div>
    </Card>
  );
}
