import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { mockCars } from "../data/cars";
import type { Car, Rental } from "../data/types";
import { getCarHealth } from "../lib/maintenance";

interface RentInput {
  renterName: string;
  renterId: string;
  startDate: Date;
  endDate: Date;
  idPhoto?: string | null;
}

export type ActivityKind = "added" | "rented" | "returned" | "alert";
export type ActivitySeverity = "info" | "warning" | "critical";

export interface Activity {
  id: string;
  kind: ActivityKind;
  severity: ActivitySeverity;
  title: string;
  detail: string;
  timestamp: string;
}

interface CarsContextValue {
  cars: Car[];
  activities: Activity[];
  addCar: (car: Omit<Car, "id" | "status" | "currentRental">) => void;
  rentCar: (carId: string, input: RentInput) => void;
  returnCar: (carId: string) => void;
}

const CarsContext = createContext<CarsContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function CarsProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [activities, setActivities] = useState<Activity[]>([]);
  const seededRef = useRef(false);

  const pushActivity = useCallback((a: Omit<Activity, "id" | "timestamp">) => {
    setActivities((prev) =>
      [
        {
          ...a,
          id: makeId("act"),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 60),
    );
  }, []);

  // Seed initial alert activities from current fleet state.
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    const now = new Date();
    const seeded: Activity[] = [];

    cars.forEach((car) => {
      const { metrics } = getCarHealth(car, now);
      metrics.forEach((m) => {
        if (m.severity === "critical" || m.severity === "warning") {
          seeded.push({
            id: makeId("seed"),
            kind: "alert",
            severity: m.severity === "critical" ? "critical" : "warning",
            title: `${m.label} alert`,
            detail: `${car.brand} ${car.model} (${car.plate}) — ${m.detail}`,
            timestamp: new Date(
              now.getTime() - Math.floor(Math.random() * 6 * 3600 * 1000),
            ).toISOString(),
          });
        }
      });
      if (car.status === "Rented" && car.currentRental) {
        seeded.push({
          id: makeId("seed"),
          kind: "rented",
          severity: "info",
          title: "Vehicle rented",
          detail: `${car.brand} ${car.model} rented by ${car.currentRental.renter.name} (${car.currentRental.renter.id})`,
          timestamp: car.currentRental.startDate,
        });
      }
    });

    seeded.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    setActivities(seeded.slice(0, 30));
  }, [cars]);

  const addCar = useCallback<CarsContextValue["addCar"]>(
    (car) => {
      const newCar: Car = {
        ...car,
        id: makeId("car"),
        status: "Available",
      };
      setCars((prev) => [newCar, ...prev]);
      pushActivity({
        kind: "added",
        severity: "info",
        title: "Vehicle added",
        detail: `${newCar.brand} ${newCar.model} (${newCar.plate}) joined the fleet`,
      });
    },
    [pushActivity],
  );

  const rentCar = useCallback<CarsContextValue["rentCar"]>(
    (carId, input) => {
      let target: Car | undefined;
      setCars((prev) =>
        prev.map((c) => {
          if (c.id !== carId) return c;
          const rental: Rental = {
            id: makeId("rent"),
            renter: { id: input.renterId, name: input.renterName },
            startDate: input.startDate.toISOString(),
            endDate: input.endDate.toISOString(),
          };
          target = { ...c, status: "Rented", currentRental: rental };
          return target;
        }),
      );
      if (target) {
        pushActivity({
          kind: "rented",
          severity: "info",
          title: "Vehicle rented",
          detail: `${target.brand} ${target.model} rented by ${input.renterName} (${input.renterId})`,
        });
      }
    },
    [pushActivity],
  );

  const returnCar = useCallback<CarsContextValue["returnCar"]>(
    (carId) => {
      let target: Car | undefined;
      setCars((prev) =>
        prev.map((c) => {
          if (c.id !== carId) return c;
          target = c;
          const { currentRental: _r, ...rest } = c;
          return { ...rest, status: "Available" };
        }),
      );
      if (target) {
        pushActivity({
          kind: "returned",
          severity: "info",
          title: "Vehicle returned",
          detail: `${target.brand} ${target.model} (${target.plate}) is back in the fleet`,
        });
      }
    },
    [pushActivity],
  );

  const value = useMemo(
    () => ({ cars, activities, addCar, rentCar, returnCar }),
    [cars, activities, addCar, rentCar, returnCar],
  );

  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

export function useCars() {
  const ctx = useContext(CarsContext);
  if (!ctx) {
    throw new Error("useCars must be used inside a CarsProvider");
  }
  return ctx;
}
