import React from "react";
import { Car } from "../data/types";
import { getCarHealthScore, HealthMetric } from "../lib/maintenance";
import { format, differenceInHours, differenceInDays } from "date-fns";

function HealthDot({ metric }: { metric: HealthMetric }) {
  const isCritical = metric.severity === "critical";
  const isWarning = metric.severity === "warning";
  
  let colorClass = "bg-emerald-500";
  if (isCritical) colorClass = "bg-red-500";
  else if (isWarning) colorClass = "bg-amber-500";

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        {isCritical && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 bg-red-400" style={{ animationDuration: '2s' }}></span>}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${colorClass}`}></span>
      </span>
      <span>{metric.label}</span>
    </div>
  );
}

function getTimeRemaining(endDate: string) {
  const end = new Date(endDate);
  const now = new Date("2026-04-25T12:00:00Z"); // Using mock current date
  const hours = differenceInHours(end, now);
  
  if (hours <= 0) return "overdue";
  
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  
  if (d > 0) return `in ${d}d ${h}h`;
  return `in ${h}h`;
}

export function CarCard({ car }: { car: Car }) {
  const health = getCarHealthScore(car);
  
  let statusDotColor = "bg-emerald-500";
  if (car.status === "Rented") statusDotColor = "bg-primary";
  else if (car.status === "Maintenance") statusDotColor = "bg-amber-500";

  return (
    <div className="flex flex-col overflow-hidden bg-card border rounded-xl shadow-sm hover:border-foreground/20 transition-colors duration-150">
      <div className="p-5 pb-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-base">{car.brand} {car.model}</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted border text-xs font-medium">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor}`}></span>
            {car.status}
          </div>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{car.plate} &middot; {car.year} &middot; {car.currentKm.toLocaleString()} km</p>
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col gap-4">
        {car.status === "Rented" && car.currentRental && (
          <div className="bg-muted/50 rounded-md p-3 border text-sm flex justify-between items-center">
            <span className="font-medium truncate mr-2">{car.currentRental.renter.name}</span>
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              Returns {format(new Date(car.currentRental.endDate), "MMM d")} &middot; {getTimeRemaining(car.currentRental.endDate)}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 pt-2">
          {health.metrics.map(m => (
            <HealthDot key={m.type} metric={m} />
          ))}
        </div>
      </div>
    </div>
  );
}