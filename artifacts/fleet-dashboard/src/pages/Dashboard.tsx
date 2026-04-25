import React, { useState } from "react";
import { mockCars } from "../data/cars";
import { FleetGrid } from "../components/FleetGrid";
import { StatsBar } from "../components/StatsBar";
import { AddCarSheet } from "../components/AddCarSheet";
import { PhoneNotification } from "../components/PhoneNotification";
import { Car } from "../data/types";
import { Separator } from "../components/ui/separator";

export default function Dashboard() {
  const [cars, setCars] = useState<Car[]>(mockCars);

  const handleAddCar = (newCar: Car) => {
    setCars(prev => [...prev, newCar]);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar / Sidecar */}
      <div className="w-full md:w-80 border-r border-border bg-card/30 p-6 flex flex-col gap-8 hidden md:flex shrink-0 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary">Fleet Command</h2>
          <p className="text-sm text-muted-foreground">Owner Dashboard</p>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">Mobile Alerts Preview</h3>
          <p className="text-xs text-muted-foreground mb-6">This is how critical deadlines will appear on your phone.</p>
          <div className="scale-[0.8] origin-top-left">
            <PhoneNotification />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="px-8 py-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
              <p className="text-muted-foreground text-sm">Manage your vehicles, rentals, and maintenance.</p>
            </div>
            <AddCarSheet onAdd={handleAddCar} />
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8">
          <section>
            <StatsBar cars={cars} />
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">Active Fleet</h2>
            </div>
            <FleetGrid cars={cars} />
          </section>
        </main>
      </div>
    </div>
  );
}
