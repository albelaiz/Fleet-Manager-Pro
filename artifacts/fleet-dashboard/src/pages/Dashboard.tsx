import React, { useState } from "react";
import { mockCars } from "../data/cars";
import { FleetGrid } from "../components/FleetGrid";
import { StatsBar } from "../components/StatsBar";
import { AddCarSheet } from "../components/AddCarSheet";
import { PhoneNotification } from "../components/PhoneNotification";
import { Car } from "../data/types";
import { format } from "date-fns";
import { Moon, Sun, Menu, Search } from "lucide-react";
import { useTheme } from "../components/theme-provider";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Dashboard() {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const { theme, setTheme } = useTheme();

  const handleAddCar = (newCar: Car) => {
    setCars(prev => [...prev, newCar]);
  };

  const upcomingReturns = cars
    .filter(c => c.status === "Rented" && c.currentRental)
    .sort((a, b) => new Date(a.currentRental!.endDate).getTime() - new Date(b.currentRental!.endDate).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-20 h-14 border-b bg-background flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="font-semibold tracking-tight text-base">Fleet</div>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="text-foreground">Overview</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Vehicles</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Rentals</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Alerts</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 rounded-full"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <AddCarSheet onAdd={handleAddCar} />
          <Button variant="ghost" size="icon" className="md:hidden w-8 h-8">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 py-8 md:py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Overview</h1>
          <p className="text-sm text-muted-foreground">Manage your vehicles, rentals, and maintenance.</p>
        </div>

        <section>
          <StatsBar cars={cars} />
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
          <section className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Fleet</h2>
              <div className="relative w-48">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter vehicles..." className="h-8 pl-9 text-xs" />
              </div>
            </div>
            <FleetGrid cars={cars} />
          </section>

          <aside className="w-full lg:w-80 shrink-0 space-y-10">
            <section className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Upcoming returns</h2>
              <div className="space-y-3">
                {upcomingReturns.map((car, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-3 rounded-lg border bg-card shadow-sm">
                    <div>
                      <div className="font-medium">{car.brand} {car.model}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{car.currentRental?.renter.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium tabular-nums">{format(new Date(car.currentRental!.endDate), "MMM d")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Mobile preview</h2>
              <div className="pt-2">
                <PhoneNotification />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}