import { AnimatePresence, motion } from "framer-motion";
import { differenceInDays, differenceInHours, format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CornerDownLeft,
  FileText,
  IdCard,
  KeyRound,
  Phone,
  X,
} from "lucide-react";
import type { Car } from "../data/types";
import { Button } from "./ui/button";
import { useCars } from "../context/CarsContext";
import { useLocale } from "../hooks/useLocale";

interface Props {
  car: Car | null;
  onClose: () => void;
}

function pct(start: Date, end: Date, now: Date) {
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 100;
  const elapsed = now.getTime() - start.getTime();
  const p = (elapsed / total) * 100;
  return Math.max(0, Math.min(100, p));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RenterProfileDrawer({ car, onClose }: Props) {
  const { returnCar } = useCars();
  const { t } = useTranslation();
  const { dateFnsLocale, rtl } = useLocale();
  const open = !!car && !!car.currentRental;

  return (
    <AnimatePresence>
      {open && car?.currentRental && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 glass-overlay"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: rtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={`fixed top-0 z-50 h-[100dvh] w-full sm:w-[440px] glass-panel shadow-2xl flex flex-col ${
              rtl ? "left-0 border-r" : "right-0 border-l"
            }`}
          >
            <div className="flex items-center justify-between px-6 h-14 border-b shrink-0">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground font-medium">
                <KeyRound className="w-3.5 h-3.5" /> {t("renter.activeRental")}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                  {t("renter.vehicle")}
                </div>
                <div className="text-base font-semibold">
                  {car.brand} {car.model}
                </div>
                <div className="text-xs text-muted-foreground tabular-nums font-mono">
                  {car.plate} · {car.year} · {car.currentKm.toLocaleString()} km
                </div>
              </div>

              <div className="card-glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border border-white/10 bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center text-base font-medium tracking-wide shrink-0">
                    {initials(car.currentRental.renter.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-light tracking-tight leading-tight truncate">
                      {car.currentRental.renter.name}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      {car.currentRental.renter.id}
                    </div>
                  </div>
                </div>

                <TimeRemainingBar
                  startDate={car.currentRental.startDate}
                  endDate={car.currentRental.endDate}
                />
              </div>

              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                  {t("renter.rental")}
                </div>
                <div className="card-glass rounded-xl p-4 grid grid-cols-2 gap-4">
                  <InfoRow
                    icon={CalendarDays}
                    label={t("renter.start")}
                    value={format(
                      new Date(car.currentRental.startDate),
                      "PPP",
                      { locale: dateFnsLocale },
                    )}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label={t("renter.end")}
                    value={format(
                      new Date(car.currentRental.endDate),
                      "PPP",
                      { locale: dateFnsLocale },
                    )}
                  />
                  <InfoRow
                    icon={Phone}
                    label={t("renter.contact")}
                    value="—"
                    mono
                  />
                  <InfoRow
                    icon={KeyRound}
                    label={t("renter.rentalId")}
                    value={car.currentRental.id.slice(-8)}
                    mono
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                  {t("renter.documents")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <DocCard
                    icon={IdCard}
                    label={t("renter.idCard")}
                    sub={t("renter.idCardSub")}
                  />
                  <DocCard
                    icon={FileText}
                    label={t("renter.contract")}
                    sub={t("renter.contractSub")}
                  />
                </div>
              </div>
            </div>

            <div className="border-t p-4 shrink-0">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  returnCar(car.id);
                  onClose();
                }}
              >
                <CornerDownLeft className="w-4 h-4 rtl:rotate-180" />{" "}
                {t("fleet.markReturned")}
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function TimeRemainingBar({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { t } = useTranslation();
  const { dateFnsLocale } = useLocale();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  const progress = pct(start, end, now);
  const remaining = progress >= 100 ? 0 : 100 - progress;

  const hours = differenceInHours(end, now);
  const days = differenceInDays(end, now);

  let label = t("renter.overdue");
  if (hours > 0) {
    label =
      days > 0
        ? t("renter.daysLeft", { count: days })
        : t("renter.hoursLeft", { count: hours });
  }

  const isOverdue = hours <= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground uppercase tracking-[0.14em] text-[10px] font-medium">
          {t("renter.timeRemaining")}
        </span>
        <span
          className={`tabular-nums font-medium ${
            isOverdue ? "text-red-400" : "text-foreground"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden" dir="ltr">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${remaining}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${
            isOverdue
              ? "bg-red-500"
              : remaining < 25
                ? "bg-amber-500"
                : "bg-primary"
          }`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>{format(start, "MMM d", { locale: dateFnsLocale })}</span>
        <span>{format(end, "MMM d", { locale: dateFnsLocale })}</span>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className={`text-sm ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function DocCard({
  icon: Icon,
  label,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      className="card-glass rounded-xl p-4 text-start hover:border-foreground/20 transition-colors group"
    >
      <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </button>
  );
}
