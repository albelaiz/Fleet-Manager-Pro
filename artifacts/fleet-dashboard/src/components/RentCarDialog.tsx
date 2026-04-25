import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { CalendarIcon, KeyRound } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useCars } from "../context/CarsContext";
import { useToast } from "../hooks/use-toast";
import type { Car } from "../data/types";
import { cn } from "../lib/utils";

export function RentCarDialog({ car }: { car: Car }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [renterId, setRenterId] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { rentCar } = useCars();
  const { toast } = useToast();

  const reset = () => {
    setName("");
    setRenterId("");
    setRange(undefined);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Renter name is required.");
    if (!renterId.trim()) return setError("Renter ID is required.");
    if (!range?.from || !range?.to)
      return setError("Please pick a start and end date.");

    rentCar(car.id, {
      renterName: name.trim(),
      renterId: renterId.trim(),
      startDate: range.from,
      endDate: range.to,
    });

    toast({
      title: "Vehicle rented out",
      description: `${car.brand} ${car.model} returns ${format(range.to, "MMM d")}.`,
    });

    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs gap-1">
          <KeyRound className="w-3 h-3" /> Rent out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rent out vehicle</DialogTitle>
          <DialogDescription>
            {car.brand} {car.model} · {car.plate}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="renterName" className="text-xs">
                Renter name
              </Label>
              <Input
                id="renterName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="renterId" className="text-xs">
                ID number
              </Label>
              <Input
                id="renterId"
                value={renterId}
                onChange={(e) => setRenterId(e.target.value)}
                placeholder="ID-12345"
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Rental period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full h-9 justify-start text-left font-normal",
                    !range && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 w-4 h-4" />
                  {range?.from ? (
                    range.to ? (
                      <span className="tabular-nums">
                        {format(range.from, "MMM d, yyyy")} →{" "}
                        {format(range.to, "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="tabular-nums">
                        {format(range.from, "MMM d, yyyy")}
                      </span>
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={2}
                  defaultMonth={range?.from ?? new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm rental</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
