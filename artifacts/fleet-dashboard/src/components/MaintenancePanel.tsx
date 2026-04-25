import { useMemo } from "react";
import { motion } from "framer-motion";
import { differenceInDays } from "date-fns";
import { useCars } from "../context/CarsContext";
import { MaintenanceRing } from "./MaintenanceRing";
import { getCarHealth, type Severity } from "../lib/maintenance";
import type { Car } from "../data/types";
import { ShieldAlert } from "lucide-react";

const TIRE_HORIZON_DAYS = 60;
const OIL_HORIZON_KM = 3000;
const INSURANCE_HORIZON_DAYS = 90;

function tireProgress(car: Car, now: Date) {
  const days = differenceInDays(new Date(car.tireChangeDate), now);
  if (days <= 0) return 100;
  if (days >= TIRE_HORIZON_DAYS) return 0;
  return ((TIRE_HORIZON_DAYS - days) / TIRE_HORIZON_DAYS) * 100;
}

function oilProgress(car: Car) {
  const remaining = car.oilChangeKm - car.currentKm;
  if (remaining <= 0) return 100;
  if (remaining >= OIL_HORIZON_KM) return 0;
  return ((OIL_HORIZON_KM - remaining) / OIL_HORIZON_KM) * 100;
}

function insuranceProgress(car: Car, now: Date) {
  const days = differenceInDays(new Date(car.insuranceDate), now);
  if (days <= 0) return 100;
  if (days >= INSURANCE_HORIZON_DAYS) return 0;
  return ((INSURANCE_HORIZON_DAYS - days) / INSURANCE_HORIZON_DAYS) * 100;
}

const severityRank: Record<Severity, number> = {
  critical: 3,
  warning: 2,
  healthy: 1,
};

export function MaintenancePanel() {
  const { cars } = useCars();

  const ranked = useMemo(() => {
    const now = new Date();
    return cars
      .map((car) => ({ car, health: getCarHealth(car, now), now }))
      .filter((x) => x.health.criticalCount > 0 || x.health.warningCount > 0)
      .sort((a, b) => {
        const sa = severityRank[a.health.overallSeverity];
        const sb = severityRank[b.health.overallSeverity];
        if (sb !== sa) return sb - sa;
        return b.health.criticalCount - a.health.criticalCount;
      })
      .slice(0, 4);
  }, [cars]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Maintenance Pulse
        </h2>
        <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
          {ranked.length} at risk
        </span>
      </div>

      {ranked.length === 0 ? (
        <div className="card-glass rounded-xl p-6 text-center">
          <ShieldAlert className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">
            All vehicles within healthy thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ranked.map(({ car, health, now }, i) => {
            const tire = health.metrics[0];
            const oil = health.metrics[1];
            const ins = health.metrics[2];
            const isCritical = health.overallSeverity === "critical";

            return (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`card-glass rounded-2xl p-4 ${
                  isCritical ? "neon-pulse" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-sm tracking-tight truncate">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono tabular-nums">
                      {car.plate}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0.5 rounded ${
                      isCritical
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {health.overallSeverity}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <MaintenanceRing
                    progress={tireProgress(car, now)}
                    severity={tire.severity}
                    label="Tires"
                    value={tire.detail}
                  />
                  <MaintenanceRing
                    progress={oilProgress(car)}
                    severity={oil.severity}
                    label="Oil"
                    value={oil.detail}
                  />
                  <MaintenanceRing
                    progress={insuranceProgress(car, now)}
                    severity={ins.severity}
                    label="Insurance"
                    value={ins.detail}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
