import { motion } from "framer-motion";
import type { Severity } from "../lib/maintenance";

interface Props {
  progress: number; // 0..100, where 100 = at deadline
  severity: Severity;
  label: string;
  value: string;
  size?: number;
  stroke?: number;
}

const colorBySeverity: Record<Severity, string> = {
  healthy: "hsl(160 84% 39%)",
  warning: "hsl(38 92% 50%)",
  critical: "hsl(0 72% 51%)",
};

export function MaintenanceRing({
  progress,
  severity,
  label,
  value,
  size = 64,
  stroke = 5,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;
  const color = colorBySeverity[severity];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              filter:
                severity === "critical"
                  ? `drop-shadow(0 0 6px ${color})`
                  : undefined,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums">
          {Math.round(clamped)}%
        </div>
      </div>
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </div>
        <div className="text-[11px] tabular-nums mt-0.5">{value}</div>
      </div>
    </div>
  );
}
