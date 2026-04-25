import React from "react";
import { Car } from "../data/types";
import { CarCard } from "./CarCard";

export function FleetGrid({ cars }: { cars: Car[] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-in fade-in duration-500">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}