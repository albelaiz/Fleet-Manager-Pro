import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car } from "../data/types";
import { getCarHealth, type HealthMetric } from "../lib/maintenance";
import { format, differenceInHours } from "date-fns";
import { RentCarDialog } from "./RentCarDialog";
import { Button } from "./ui/button";
import { useCars } from "../context/CarsContext";
import { ChevronRight, CornerDownLeft } from "lucide-react";

function HealthDot({ metric }: { metric: HealthMetric }) {
  const isCritical = metric.severity === "critical";
  const isWarning = metric.severity === "warning";

  let dotColor = "bg-emerald-500";
  let pingColor = "bg-red-400";
  if (isCritical) dotColor = "bg-red-500";
  else if (isWarning) dotColor = "bg-amber-500";

  return (
    <div
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
      title={`${metric.label}: ${metric.detail}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isCritical && (
          <span
            className={`animate-soft-pulse absolute inline-flex h-full w-full rounded-full ${pingColor}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`}
        />
      </span>
      <span>{metric.label}</span>
    </div>
  );
}

function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatCountdown(endDate: string, now: Date) {
  const end = new Date(endDate);
  const hours = differenceInHours(end, now);
  if (hours <= 0) return "overdue";
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  if (d > 0) return `in ${d}d ${h}h`;
  return `in ${h}h`;
}

interface Props {
  car: Car;
  index?: number;
  onOpenRenter?: (car: Car) => void;
}

export function CarCard({ car, index = 0, onOpenRenter }: Props) {
  const now = useNow();
  const health = getCarHealth(car, now);
  const { returnCar } = useCars();
  const countdown = car.currentRental
    ? formatCountdown(car.currentRental.endDate, now)
    : null;

  let statusDot = "bg-emerald-500";
  if (car.status === "Rented") statusDot = "bg-primary";
  else if (car.status === "Maintenance") statusDot = "bg-amber-500";

  const isCritical = health.overallSeverity === "critical";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -3 }}
      className={`card-glass rounded-2xl flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-2xl ${
        isCritical ? "neon-pulse" : ""
      }`}
    >
      <div className="p-5 pb-4">
        <div className="flex justify-between items-start mb-1.5 gap-3">
          <h3 className="font-medium text-base tracking-tight">
            {car.brand} {car.model}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-background/40 text-[11px] font-medium whitespace-nowrap">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
            {car.status}
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground tabular-nums">
          {car.plate} &middot; {car.year} &middot;{" "}
          {car.currentKm.toLocaleString()} km
        </p>
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col gap-4">
        {car.status === "Rented" && car.currentRental && (
          <button
            type="button"
            onClick={() => onOpenRenter?.(car)}
            className="text-left bg-background/30 rounded-lg p-3 border border-white/[0.04] hover:border-white/10 hover:bg-background/50 transition-colors group"
          >
            <div className="flex justify-between items-center gap-2">
              <span className="font-medium text-sm truncate">
                {car.currentRental.renter.name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground tabular-nums font-mono mt-1">
              <span>
                {format(new Date(car.currentRental.startDate), "MMM d")} →{" "}
                {format(new Date(car.currentRental.endDate), "MMM d")}
              </span>
              <span className="font-medium text-foreground">{countdown}</span>
            </div>
          </button>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            {health.metrics.map((m) => (
              <HealthDot key={m.type} metric={m} />
            ))}
          </div>

          {car.status === "Available" && <RentCarDialog car={car} />}
          {car.status === "Rented" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2.5 text-xs gap-1 text-muted-foreground"
              onClick={() => returnCar(car.id)}
            >
              <CornerDownLeft className="w-3 h-3" /> Return
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
