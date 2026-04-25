import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CarCard } from "./CarCard";
import { useCars } from "../context/CarsContext";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import type { Car } from "../data/types";

interface Props {
  onOpenRenter?: (car: Car) => void;
}

export function FleetGrid({ onOpenRenter }: Props) {
  const { cars } = useCars();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter(
      (c) =>
        c.plate.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q),
    );
  }, [cars, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {t("fleet.title")}
        </h2>
        <div className="relative w-48">
          <Search className="w-4 h-4 absolute start-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("fleet.filter")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 ps-9 text-xs bg-background/30 backdrop-blur"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-glass rounded-xl p-10 text-center text-sm text-muted-foreground">
          {t("fleet.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              onOpenRenter={onOpenRenter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
