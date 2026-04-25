import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { StatsBar } from "../components/StatsBar";
import { AddCarSheet } from "../components/AddCarSheet";
import { FleetGrid } from "../components/FleetGrid";
import { TimelineView } from "../components/TimelineView";
import { MaintenancePanel } from "../components/MaintenancePanel";
import { ActivityDrawer } from "../components/ActivityDrawer";
import { RenterProfileDrawer } from "../components/RenterProfileDrawer";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useCars } from "../context/CarsContext";
import type { Car } from "../data/types";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../components/theme-provider";
import { Button } from "../components/ui/button";
import { useLocale } from "../hooks/useLocale";

type Tab = "overview" | "timeline";

export default function Dashboard() {
  const { cars, activities } = useCars();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { dateFnsLocale, lang } = useLocale();
  const [tab, setTab] = useState<Tab>("overview");
  const [activityOpen, setActivityOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const upcomingReturns = cars
    .filter((c) => c.status === "Rented" && c.currentRental)
    .sort(
      (a, b) =>
        new Date(a.currentRental!.endDate).getTime() -
        new Date(b.currentRental!.endDate).getTime(),
    )
    .slice(0, 3);

  const unreadCount = activities.filter(
    (a) => a.severity === "critical" || a.severity === "warning",
  ).length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: t("nav.overview") },
    { id: "timeline", label: t("nav.timeline") },
  ];

  const todayLabel = format(new Date(), "EEEE, PPP", {
    locale: dateFnsLocale,
  });

  return (
    <motion.div
      key={lang}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] text-foreground flex flex-col font-sans"
    >
      <header className="sticky top-0 z-30 h-14 border-b border-white/[0.05] glass-panel flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_18px_-4px_hsl(var(--primary)/0.4)]">
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <div className="font-medium tracking-tight text-base">Fleet</div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {tabs.map((ti) => (
              <button
                key={ti.id}
                onClick={() => setTab(ti.id)}
                className={`relative px-3 py-1.5 rounded-md transition-colors ${
                  tab === ti.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === ti.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white/[0.06] border border-white/[0.06] rounded-md"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative">{ti.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full relative"
            onClick={() => setActivityOpen(true)}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 end-1 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_6px_hsl(0_90%_55%/0.8)]" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
          <LanguageSwitcher />
          <AddCarSheet />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={lang}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-7xl w-full mx-auto p-6 py-10 md:py-14 space-y-12"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">
              {tab === "overview"
                ? t("page.commandCenter")
                : t("page.masterTimeline")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tab === "overview"
                ? `${todayLabel} — ${t("page.subtitleOverview")}`
                : t("page.subtitleTimeline")}
            </p>
          </div>

          <section>
            <StatsBar />
          </section>

          <AnimatePresence mode="wait">
            {tab === "overview" ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:flex-row gap-10"
              >
                <section className="flex-1 min-w-0">
                  <FleetGrid onOpenRenter={setSelectedCar} />
                </section>

                <aside className="w-full lg:w-80 shrink-0 space-y-10">
                  <MaintenancePanel />

                  <section className="space-y-4">
                    <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {t("upcomingReturns")}
                    </h2>
                    {upcomingReturns.length === 0 ? (
                      <div className="card-glass rounded-xl p-4 text-sm text-muted-foreground">
                        {t("noActiveRentals")}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingReturns.map((car) => (
                          <button
                            key={car.id}
                            onClick={() => setSelectedCar(car)}
                            className="w-full text-start card-glass rounded-xl p-3 flex justify-between items-center hover:border-white/15 transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">
                                {car.brand} {car.model}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                {car.currentRental?.renter.name}
                              </div>
                            </div>
                            <div className="text-end shrink-0 ms-3">
                              <div className="font-medium tabular-nums text-sm">
                                {format(
                                  new Date(car.currentRental!.endDate),
                                  "PP",
                                  { locale: dateFnsLocale },
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                </aside>
              </motion.div>
            ) : (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <TimelineView onOpenRenter={setSelectedCar} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </AnimatePresence>

      <ActivityDrawer
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
      />
      <RenterProfileDrawer
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
      />
    </motion.div>
  );
}
