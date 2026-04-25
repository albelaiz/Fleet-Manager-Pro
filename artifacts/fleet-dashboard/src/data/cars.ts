import { Car } from "./types";

export const mockCars: Car[] = [
  {
    id: "car-1",
    plate: "XYZ-123",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    currentKm: 45000,
    status: "Rented",
    currentRental: {
      id: "rent-1",
      renter: { id: "u-1", name: "Alice Johnson", phone: "555-0101" },
      startDate: "2026-04-22T08:00:00Z",
      endDate: "2026-04-28T18:00:00Z"
    },
    maintenance: {
      lastOilChangeKm: 45000, // EV, no oil, but using as general maintenance metric
      oilChangeIntervalKm: 20000,
      lastTireChangeDate: "2024-01-15T00:00:00Z",
      insuranceExpiryDate: "2026-11-01T00:00:00Z"
    }
  },
  {
    id: "car-2",
    plate: "ABC-987",
    brand: "BMW",
    model: "X5",
    year: 2021,
    currentKm: 85200,
    status: "Available",
    maintenance: {
      lastOilChangeKm: 78000,
      oilChangeIntervalKm: 10000, // approaching warning
      lastTireChangeDate: "2023-05-10T00:00:00Z",
      insuranceExpiryDate: "2026-05-02T00:00:00Z" // critical
    }
  },
  {
    id: "car-3",
    plate: "DEF-456",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    currentKm: 112000,
    status: "Maintenance",
    maintenance: {
      lastOilChangeKm: 111800,
      oilChangeIntervalKm: 15000,
      lastTireChangeDate: "2022-11-20T00:00:00Z",
      insuranceExpiryDate: "2026-08-15T00:00:00Z"
    }
  },
  {
    id: "car-4",
    plate: "GHI-789",
    brand: "Renault",
    model: "Clio",
    year: 2022,
    currentKm: 32000,
    status: "Rented",
    currentRental: {
      id: "rent-2",
      renter: { id: "u-2", name: "Bob Smith", phone: "555-0102" },
      startDate: "2026-04-24T10:00:00Z",
      endDate: "2026-04-26T10:00:00Z" // returns soon
    },
    maintenance: {
      lastOilChangeKm: 25000,
      oilChangeIntervalKm: 10000,
      lastTireChangeDate: "2025-02-10T00:00:00Z",
      insuranceExpiryDate: "2027-01-10T00:00:00Z"
    }
  },
  {
    id: "car-5",
    plate: "JKL-012",
    brand: "Audi",
    model: "A4",
    year: 2024,
    currentKm: 15000,
    status: "Available",
    maintenance: {
      lastOilChangeKm: 14000,
      oilChangeIntervalKm: 15000,
      lastTireChangeDate: "2024-03-01T00:00:00Z",
      insuranceExpiryDate: "2026-04-30T00:00:00Z" // warning
    }
  },
  {
    id: "car-6",
    plate: "MNO-345",
    brand: "Mercedes",
    model: "C-Class",
    year: 2023,
    currentKm: 41000,
    status: "Available",
    maintenance: {
      lastOilChangeKm: 31000, // exact interval, critical
      oilChangeIntervalKm: 10000,
      lastTireChangeDate: "2024-06-15T00:00:00Z",
      insuranceExpiryDate: "2026-10-20T00:00:00Z"
    }
  }
];
