import { differenceInDays } from "date-fns";
import { Car } from "../data/types";

export type Severity = "healthy" | "warning" | "critical";

export interface HealthMetric {
  label: string;
  value: string | number;
  severity: Severity;
  type: "oil" | "tire" | "insurance";
}

const TIRE_LIFESPAN_DAYS = 365 * 3; // roughly 3 years

export function getTireHealth(car: Car, currentDate: Date = new Date("2026-04-25T12:00:00Z")): HealthMetric {
  const lastChange = new Date(car.maintenance.lastTireChangeDate);
  const daysSinceChange = differenceInDays(currentDate, lastChange);
  const daysRemaining = TIRE_LIFESPAN_DAYS - daysSinceChange;

  let severity: Severity = "healthy";
  if (daysRemaining <= 30 && daysRemaining > 7) severity = "warning";
  if (daysRemaining <= 7) severity = "critical";

  return {
    label: "Tires",
    value: `${daysRemaining > 0 ? daysRemaining : 0} days`,
    severity,
    type: "tire"
  };
}

export function getOilHealth(car: Car): HealthMetric {
  const kmSinceChange = car.currentKm - car.maintenance.lastOilChangeKm;
  const kmRemaining = car.maintenance.oilChangeIntervalKm - kmSinceChange;

  let severity: Severity = "healthy";
  if (kmRemaining <= 1000 && kmRemaining > 200) severity = "warning";
  if (kmRemaining <= 200) severity = "critical";

  return {
    label: "Oil",
    value: `${kmRemaining > 0 ? kmRemaining : 0} km`,
    severity,
    type: "oil"
  };
}

export function getInsuranceHealth(car: Car, currentDate: Date = new Date("2026-04-25T12:00:00Z")): HealthMetric {
  const expiry = new Date(car.maintenance.insuranceExpiryDate);
  const daysRemaining = differenceInDays(expiry, currentDate);

  let severity: Severity = "healthy";
  if (daysRemaining <= 30 && daysRemaining > 7) severity = "warning";
  if (daysRemaining <= 7) severity = "critical";

  return {
    label: "Insurance",
    value: `${daysRemaining > 0 ? daysRemaining : 0} days`,
    severity,
    type: "insurance"
  };
}

export function getCarHealthScore(car: Car, currentDate: Date = new Date("2026-04-25T12:00:00Z")): { score: number, metrics: HealthMetric[], overallSeverity: Severity } {
  const metrics = [
    getTireHealth(car, currentDate),
    getOilHealth(car),
    getInsuranceHealth(car, currentDate)
  ];

  const criticalCount = metrics.filter(m => m.severity === "critical").length;
  const warningCount = metrics.filter(m => m.severity === "warning").length;

  let overallSeverity: Severity = "healthy";
  if (warningCount > 0) overallSeverity = "warning";
  if (criticalCount > 0) overallSeverity = "critical";

  // Dummy score calculation
  let score = 100 - (criticalCount * 30) - (warningCount * 10);
  if (score < 0) score = 0;

  return { score, metrics, overallSeverity };
}
