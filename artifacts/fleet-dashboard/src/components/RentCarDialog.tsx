import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
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
import {
  CalendarIcon,
  KeyRound,
  Upload,
  ScanLine,
  X as XIcon,
} from "lucide-react";
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
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { rentCar } = useCars();
  const { toast } = useToast();

  const reset = () => {
    setName("");
    setRenterId("");
    setRange(undefined);
    setIdPhoto(null);
    setError(null);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setIdPhoto(reader.result as string);
    reader.readAsDataURL(file);
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
      idPhoto,
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
      <DialogPortal>
        <DialogOverlay className="glass-overlay !bg-transparent" />
        <DialogContent className="sm:max-w-lg glass-panel border-card-border shadow-2xl !bg-transparent">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          >
            <DialogHeader>
              <DialogTitle className="text-lg">Rent out vehicle</DialogTitle>
              <DialogDescription>
                {car.brand} {car.model} · {car.plate}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-5">
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

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5" /> ID card scan
                </Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {idPhoto ? (
                  <div className="relative rounded-lg overflow-hidden border bg-muted/40 group">
                    <img
                      src={idPhoto}
                      alt="ID preview"
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      onClick={() => setIdPhoto(null)}
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-32 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-foreground/30 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      Scan or upload ID card
                    </span>
                    <span className="text-[10px]">
                      JPG, PNG · stays on device
                    </span>
                  </button>
                )}
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <DialogFooter className="gap-2 pt-2">
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
          </motion.div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
