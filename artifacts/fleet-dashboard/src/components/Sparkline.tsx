import { motion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  values: number[];
  color?: string;
  height?: number;
  width?: number;
  fill?: boolean;
}

export function Sparkline({
  values,
  color = "hsl(217 91% 65%)",
  height = 36,
  width = 110,
  fill = true,
}: Props) {
  const { linePath, areaPath } = useMemo(() => {
    if (values.length === 0) return { linePath: "", areaPath: "" };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const stepX = width / Math.max(values.length - 1, 1);
    const padY = 4;

    const points = values.map((v, i) => {
      const x = i * stepX;
      const y =
        height - padY - ((v - min) / range) * (height - padY * 2);
      return [x, y] as const;
    });

    const linePath = points
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");

    const areaPath = `${linePath} L ${width.toFixed(2)} ${height} L 0 ${height} Z`;

    return { linePath, areaPath };
  }, [values, height, width]);

  const gradId = useMemo(
    () => `spark-grad-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={areaPath} fill={`url(#${gradId})`} />}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
