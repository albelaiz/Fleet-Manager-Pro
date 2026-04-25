export type CarStatus = "Available" | "Rented" | "Maintenance";

export interface Renter {
  id: string;
  name: string;
}

export interface Rental {
  id: string;
  renter: Renter;
  startDate: string;
  endDate: string;
}

export interface Car {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
  oilChangeKm: number;
  tireChangeDate: string;
  insuranceDate: string;
  status: CarStatus;
  currentRental?: Rental;
}
