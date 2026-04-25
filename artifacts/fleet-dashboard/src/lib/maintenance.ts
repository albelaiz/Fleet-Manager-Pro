import { differenceInDays } from "date-fns";
import { Car } from "../data/types";

export type Severity = "healthy" | "warning" | "critical";

export interface HealthMetric {
  label: string;
  detail: string;
  severity: Severity;
  type: "oil" | "tire" | "insurance";
}

export function getTireHealth(car: Car, now: Date = new Date()): HealthMetric {
  const target = new Date(car.tireChangeDate);
  const days = differenceInDays(target, now);

  let severity: Severity = "healthy";
  if (days < 7) severity = "critical";
  else if (days <= 30) severity = "warning";

  const detail =
    days < 0
      ? `${Math.abs(days)}d overdue`
      : days === 0
        ? "due today"
        : `in ${days}d`;

  return { label: "Tires", detail, severity, type: "tire" };
}

export function getOilHealth(car: Car): HealthMetric {
  const remaining = car.oilChangeKm - car.currentKm;

  let severity: Severity = "healthy";
  if (remaining <= 0) severity = "critical";
  else if (remaining <= 500) severity = "warning";

  const detail =
    remaining < 0
      ? `${Math.abs(remaining).toLocaleString()} km over`
      : `${remaining.toLocaleString()} km left`;

  return { label: "Oil", detail, severity, type: "oil" };
}

export function getInsuranceHealth(
  car: Car,
  now: Date = new Date(),
): HealthMetric {
  const expiry = new Date(car.insuranceDate);
  const days = differenceInDays(expiry, now);

  let severity: Severity = "healthy";
  if (days < 7) severity = "critical";
  else if (days <= 30) severity = "warning";

  const detail =
    days < 0
      ? `${Math.abs(days)}d expired`
      : days === 0
        ? "expires today"
        : `${days}d left`;

  return { label: "Insurance", detail, severity, type: "insurance" };
}

export function getCarHealth(car: Car, now: Date = new Date()) {
  const metrics = [
    getTireHealth(car, now),
    getOilHealth(car),
    getInsuranceHealth(car, now),
  ];

  const criticalCount = metrics.filter((m) => m.severity === "critical").length;
  const warningCount = metrics.filter((m) => m.severity === "warning").length;

  let overallSeverity: Severity = "healthy";
  if (warningCount > 0) overallSeverity = "warning";
  if (criticalCount > 0) overallSeverity = "critical";

  return { metrics, overallSeverity, criticalCount, warningCount };
}
