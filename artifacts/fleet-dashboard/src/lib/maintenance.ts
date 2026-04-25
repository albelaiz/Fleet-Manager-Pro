import { differenceInDays } from "date-fns";
import { Car } from "../data/types";

export type Severity = "healthy" | "warning" | "critical";

export interface HealthMetric {
  type: "oil" | "tire" | "insurance";
  severity: Severity;
  /** i18n key for the label, e.g. "maintenance.tires" */
  labelKey: string;
  /** i18n key for the formatted detail, e.g. "maintenance.daysLeft" */
  detailKey: string;
  /** Interpolation params for the detail key */
  detailParams: Record<string, number | string>;
}

export function getTireHealth(car: Car, now: Date = new Date()): HealthMetric {
  const target = new Date(car.tireChangeDate);
  const days = differenceInDays(target, now);

  let severity: Severity = "healthy";
  if (days < 7) severity = "critical";
  else if (days <= 30) severity = "warning";

  let detailKey = "maintenance.inDays";
  let detailParams: Record<string, number | string> = { count: days };

  if (days < 0) {
    detailKey = "maintenance.daysOverdue";
    detailParams = { count: Math.abs(days) };
  } else if (days === 0) {
    detailKey = "maintenance.dueToday";
    detailParams = {};
  }

  return {
    type: "tire",
    severity,
    labelKey: "maintenance.tires",
    detailKey,
    detailParams,
  };
}

export function getOilHealth(car: Car): HealthMetric {
  const remaining = car.oilChangeKm - car.currentKm;

  let severity: Severity = "healthy";
  if (remaining <= 0) severity = "critical";
  else if (remaining <= 500) severity = "warning";

  const detailKey =
    remaining < 0 ? "maintenance.kmOver" : "maintenance.kmLeft";
  const detailParams = {
    km: Math.abs(remaining).toLocaleString(),
  };

  return {
    type: "oil",
    severity,
    labelKey: "maintenance.oil",
    detailKey,
    detailParams,
  };
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

  let detailKey = "maintenance.daysLeft";
  let detailParams: Record<string, number | string> = { count: days };

  if (days < 0) {
    detailKey = "maintenance.daysExpired";
    detailParams = { count: Math.abs(days) };
  } else if (days === 0) {
    detailKey = "maintenance.expiresToday";
    detailParams = {};
  }

  return {
    type: "insurance",
    severity,
    labelKey: "maintenance.insurance",
    detailKey,
    detailParams,
  };
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
