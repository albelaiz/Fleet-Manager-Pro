import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { useCars } from "../context/CarsContext";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function daysInMonth(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

function clampToMonth(date: Date, monthAnchor: Date) {
  const start = startOfMonth(monthAnchor);
  const end = endOfMonth(monthAnchor);
  if (date < start) return start;
  if (date > end) return end;
  return date;
}

export function TimelineView() {
  const { cars } = useCars();
  const [anchor, setAnchor] = useState(() => new Date());

  const days = useMemo(() => daysInMonth(anchor), [anchor]);
  const today = new Date();
  const monthLabel = format(anchor, "MMMM yyyy");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Rental Timeline
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Gantt view of active and upcoming rentals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setAnchor((a) => addMonths(a, -1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm font-medium tabular-nums w-32 text-center">
            {monthLabel}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setAnchor((a) => addMonths(a, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card/60 backdrop-blur overflow-hidden shadow-sm">
        {/* Day header */}
        <div className="flex border-b sticky top-0 bg-card/80 backdrop-blur z-10">
          <div className="w-44 shrink-0 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-r">
            Vehicle
          </div>
          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
            {days.map((d) => {
              const isToday = isSameDay(d, today);
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div
                  key={d.toISOString()}
                  className={`text-[10px] tabular-nums text-center py-2 border-r last:border-r-0 ${
                    isToday
                      ? "bg-primary/10 text-primary font-semibold"
                      : isWeekend
                        ? "text-muted-foreground/60"
                        : "text-muted-foreground"
                  }`}
                >
                  {format(d, "d")}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {cars.map((car, rowIdx) => {
            const rental = car.currentRental;
            const monthStart = startOfMonth(anchor);
            const monthEnd = endOfMonth(anchor);

            let bar: { left: number; width: number } | null = null;
            if (rental) {
              const start = new Date(rental.startDate);
              const end = new Date(rental.endDate);
              const overlaps = end >= monthStart && start <= monthEnd;
              if (overlaps) {
                const clampedStart = clampToMonth(start, anchor);
                const clampedEnd = clampToMonth(end, anchor);
                const startIdx = clampedStart.getDate() - 1;
                const endIdx = clampedEnd.getDate() - 1;
                const total = days.length;
                const left = (startIdx / total) * 100;
                const width = ((endIdx - startIdx + 1) / total) * 100;
                bar = { left, width };
              }
            }

            return (
              <div key={car.id} className="flex hover:bg-muted/30 transition-colors group">
                <div className="w-44 shrink-0 px-4 py-3 border-r min-w-0">
                  <div className="text-sm font-medium truncate">
                    {car.brand} {car.model}
                  </div>
                  <div className="text-[11px] text-muted-foreground tabular-nums truncate">
                    {car.plate}
                  </div>
                </div>
                <div
                  className="flex-1 relative grid"
                  style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
                >
                  {/* day cells (background grid) */}
                  {days.map((d, i) => {
                    const isToday = isSameDay(d, today);
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <div
                        key={i}
                        className={`h-12 border-r last:border-r-0 ${
                          isToday
                            ? "bg-primary/[0.04]"
                            : isWeekend
                              ? "bg-muted/30"
                              : ""
                        }`}
                      />
                    );
                  })}

                  {/* today line */}
                  {(() => {
                    const todayInMonth =
                      today >= monthStart && today <= monthEnd;
                    if (!todayInMonth) return null;
                    const idx = today.getDate() - 1;
                    const left = ((idx + 0.5) / days.length) * 100;
                    return (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-primary/60 z-10 pointer-events-none"
                        style={{ left: `${left}%` }}
                      />
                    );
                  })()}

                  {/* rental bar */}
                  {bar && rental && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.6 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: rowIdx * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        left: `${bar.left}%`,
                        width: `${bar.width}%`,
                        transformOrigin: "left",
                      }}
                      className="absolute top-2 bottom-2 rounded-md bg-primary/90 hover:bg-primary text-primary-foreground px-2 py-1 text-[11px] font-medium shadow-sm overflow-hidden flex items-center cursor-default"
                      title={`${rental.renter.name} · ${format(new Date(rental.startDate), "MMM d")} → ${format(new Date(rental.endDate), "MMM d")}`}
                    >
                      <span className="truncate">{rental.renter.name}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-primary/90" />
          Active rental
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-px h-3 bg-primary/60" />
          Today
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-muted" />
          Weekend
        </div>
      </div>
    </div>
  );
}
