import React from "react";
import { Car } from "../data/types";
import { CarCard } from "./CarCard";
import { motion } from "framer-motion";

export function FleetGrid({ cars }: { cars: Car[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car, i) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <CarCard car={car} />
        </motion.div>
      ))}
    </div>
  );
}
