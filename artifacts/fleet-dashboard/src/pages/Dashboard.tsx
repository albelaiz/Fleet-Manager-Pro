import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StatsBar } from "../components/StatsBar";
import { AddCarSheet } from "../components/AddCarSheet";
import { FleetGrid } from "../components/FleetGrid";
import { TimelineView } from "../components/TimelineView";
import { MaintenancePanel } from "../components/MaintenancePanel";
import { ActivityDrawer } from "../components/ActivityDrawer";
import { useCars } from "../context/CarsContext";
import { format } from "date-fns";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../components/theme-provider";
import { Button } from "../components/ui/button";

type Tab = "overview" | "timeline";

export default function Dashboard() {
  const { cars, activities } = useCars();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("overview");
  const [activityOpen, setActivityOpen] = useState(false);

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
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-30 h-14 border-b glass-panel flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <div className="font-semibold tracking-tight text-base">Fleet</div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-1.5 rounded-md transition-colors ${
                  tab === t.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === t.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-muted rounded-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full relative"
            onClick={() => setActivityOpen(true)}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
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
          <AddCarSheet />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 py-10 md:py-12 space-y-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-1.5">
            {tab === "overview" ? "Command Center" : "Rental Timeline"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tab === "overview"
              ? `${format(new Date(), "EEEE, MMMM d, yyyy")} — manage your vehicles, rentals, and maintenance.`
              : "Visualize active rentals across the calendar."}
          </p>
        </div>

        <section>
          <StatsBar />
        </section>

        <AnimatePresence mode="wait">
          {tab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row gap-10"
            >
              <section className="flex-1 min-w-0">
                <FleetGrid />
              </section>

              <aside className="w-full lg:w-80 shrink-0 space-y-10">
                <MaintenancePanel />

                <section className="space-y-4">
                  <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Upcoming returns
                  </h2>
                  {upcomingReturns.length === 0 ? (
                    <div className="text-sm text-muted-foreground border rounded-lg p-4 bg-card/60 backdrop-blur">
                      No active rentals.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingReturns.map((car) => (
                        <div
                          key={car.id}
                          className="flex justify-between items-center text-sm p-3 rounded-lg border bg-card/80 backdrop-blur shadow-sm"
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">
                              {car.currentRental?.renter.name}
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <div className="font-medium tabular-nums">
                              {format(
                                new Date(car.currentRental!.endDate),
                                "MMM d",
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </aside>
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <TimelineView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ActivityDrawer
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
      />
    </div>
  );
}
