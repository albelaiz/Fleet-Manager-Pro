export type CarStatus = "Available" | "Rented" | "Maintenance";

export interface Renter {
  id: string;
  name: string;
  phone: string;
}

export interface Rental {
  id: string;
  renter: Renter;
  startDate: string; // ISO string
  endDate: string; // ISO string
}

export interface MaintenanceStatus {
  lastOilChangeKm: number;
  oilChangeIntervalKm: number;
  lastTireChangeDate: string; // ISO string
  insuranceExpiryDate: string; // ISO string
}

export interface Car {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
  status: CarStatus;
  currentRental?: Rental;
  maintenance: MaintenanceStatus;
  imageUrl?: string;
}
