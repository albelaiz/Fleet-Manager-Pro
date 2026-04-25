import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
import type { Car } from "../data/types";
import { useLocale } from "../hooks/useLocale";

interface Props {
  onOpenRenter?: (car: Car) => void;
}

const DAY_WIDTH = 44;

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

export function TimelineView({ onOpenRenter }: Props) {
  const { cars } = useCars();
  const { t } = useTranslation();
  const { dateFnsLocale, rtl } = useLocale();
  const [anchor, setAnchor] = useState(() => new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => daysInMonth(anchor), [anchor]);
  const today = new Date();
  const monthLabel = format(anchor, "LLLL yyyy", { locale: dateFnsLocale });
  const trackWidth = days.length * DAY_WIDTH;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("page.masterTimeline")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("timeline.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 card-glass rounded-full px-1.5 py-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full"
            onClick={() => setAnchor((a) => addMonths(a, -1))}
          >
            {rtl ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
          <div className="text-sm font-medium tabular-nums w-40 text-center tracking-tight capitalize">
            {monthLabel}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full"
            onClick={() => setAnchor((a) => addMonths(a, 1))}
          >
            {rtl ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="card-glass rounded-2xl overflow-hidden">
        <div className="flex" dir="ltr">
          <div className="w-48 shrink-0 border-e border-white/[0.04] bg-background/20">
            <div className="h-10 border-b border-white/[0.04] flex items-center px-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
              {t("timeline.vehicle")}
            </div>
            {cars.map((car) => (
              <div
                key={car.id}
                className="h-14 border-b border-white/[0.04] last:border-b-0 px-4 flex flex-col justify-center min-w-0"
              >
                <div className="text-sm font-medium tracking-tight truncate">
                  {car.brand} {car.model}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground tabular-nums truncate">
                  {car.plate}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto" ref={scrollRef}>
            <div style={{ width: trackWidth, minWidth: "100%" }}>
              <div className="h-10 border-b border-white/[0.04] flex sticky top-0 bg-background/40 backdrop-blur">
                {days.map((d) => {
                  const isToday = isSameDay(d, today);
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={d.toISOString()}
                      style={{ width: DAY_WIDTH }}
                      className={`shrink-0 flex flex-col items-center justify-center text-center border-r border-white/[0.03] last:border-r-0 ${
                        isToday
                          ? "text-primary"
                          : isWeekend
                            ? "text-muted-foreground/60"
                            : "text-muted-foreground"
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider">
                        {format(d, "EEE", { locale: dateFnsLocale })}
                      </span>
                      <span
                        className={`text-xs tabular-nums ${
                          isToday ? "font-semibold" : ""
                        }`}
                      >
                        {format(d, "d", { locale: dateFnsLocale })}
                      </span>
                    </div>
                  );
                })}
              </div>

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
                    const cs = clampToMonth(start, anchor);
                    const ce = clampToMonth(end, anchor);
                    const sIdx = cs.getDate() - 1;
                    const eIdx = ce.getDate() - 1;
                    bar = {
                      left: sIdx * DAY_WIDTH,
                      width: (eIdx - sIdx + 1) * DAY_WIDTH,
                    };
                  }
                }

                const todayInMonth =
                  today >= monthStart && today <= monthEnd;
                const todayLeft = todayInMonth
                  ? (today.getDate() - 1) * DAY_WIDTH + DAY_WIDTH / 2
                  : null;

                return (
                  <div
                    key={car.id}
                    className="h-14 border-b border-white/[0.04] last:border-b-0 relative flex"
                  >
                    {days.map((d, i) => {
                      const isToday = isSameDay(d, today);
                      const isWeekend =
                        d.getDay() === 0 || d.getDay() === 6;
                      return (
                        <div
                          key={i}
                          style={{ width: DAY_WIDTH }}
                          className={`shrink-0 border-r border-white/[0.03] last:border-r-0 ${
                            isToday
                              ? "bg-primary/[0.04]"
                              : isWeekend
                                ? "bg-white/[0.015]"
                                : ""
                          }`}
                        />
                      );
                    })}

                    {todayLeft !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-primary/60 z-10 pointer-events-none"
                        style={{ left: todayLeft }}
                      />
                    )}

                    {bar && rental && (
                      <motion.button
                        type="button"
                        onClick={() => onOpenRenter?.(car)}
                        initial={{ opacity: 0, scaleX: 0.6 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          duration: 0.5,
                          delay: rowIdx * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          left: bar.left + 4,
                          width: bar.width - 8,
                          transformOrigin: "left",
                        }}
                        className="absolute top-2 bottom-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-primary-foreground px-3 text-[11px] font-medium shadow-lg shadow-primary/20 ring-1 ring-white/10 overflow-hidden flex items-center cursor-pointer"
                        title={`${rental.renter.name} · ${format(new Date(rental.startDate), "PP", { locale: dateFnsLocale })} → ${format(new Date(rental.endDate), "PP", { locale: dateFnsLocale })}`}
                      >
                        <span className="truncate">{rental.renter.name}</span>
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 rounded-full bg-gradient-to-r from-primary to-primary/80" />
          {t("timeline.active")}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-px h-3 bg-primary/60" />
          {t("timeline.today")}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded-sm bg-white/[0.05]" />
          {t("timeline.weekend")}
        </div>
      </div>
    </div>
  );
}
