import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockCars } from "../data/cars";
import type { Car, Rental } from "../data/types";

interface RentInput {
  renterName: string;
  renterId: string;
  startDate: Date;
  endDate: Date;
}

interface CarsContextValue {
  cars: Car[];
  addCar: (car: Omit<Car, "id" | "status" | "currentRental">) => void;
  rentCar: (carId: string, input: RentInput) => void;
  returnCar: (carId: string) => void;
}

const CarsContext = createContext<CarsContextValue | null>(null);

export function CarsProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(mockCars);

  const addCar = useCallback<CarsContextValue["addCar"]>((car) => {
    const newCar: Car = {
      ...car,
      id: `car-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "Available",
    };
    setCars((prev) => [newCar, ...prev]);
  }, []);

  const rentCar = useCallback<CarsContextValue["rentCar"]>((carId, input) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== carId) return c;
        const rental: Rental = {
          id: `rent-${Date.now()}`,
          renter: {
            id: input.renterId,
            name: input.renterName,
          },
          startDate: input.startDate.toISOString(),
          endDate: input.endDate.toISOString(),
        };
        return { ...c, status: "Rented", currentRental: rental };
      }),
    );
  }, []);

  const returnCar = useCallback<CarsContextValue["returnCar"]>((carId) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== carId) return c;
        const { currentRental: _r, ...rest } = c;
        return { ...rest, status: "Available" };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({ cars, addCar, rentCar, returnCar }),
    [cars, addCar, rentCar, returnCar],
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
