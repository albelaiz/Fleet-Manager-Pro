import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Car } from "../data/types";
import { useToast } from "../hooks/use-toast";

const formSchema = z.object({
  plate: z.string().min(2, "Plate is required"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  year: z.coerce.number().min(1990).max(2030),
  currentKm: z.coerce.number().min(0),
  lastOilChangeKm: z.coerce.number().min(0),
  oilChangeIntervalKm: z.coerce.number().min(1000).default(10000),
  lastTireChangeDate: z.string(),
  insuranceExpiryDate: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCarSheet({ onAdd }: { onAdd: (car: Car) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      currentKm: 0,
      lastOilChangeKm: 0,
      oilChangeIntervalKm: 10000,
      lastTireChangeDate: new Date().toISOString().split("T")[0],
      insuranceExpiryDate: new Date().toISOString().split("T")[0],
    }
  });

  const onSubmit = (data: FormValues) => {
    const newCar: Car = {
      id: `car-${Date.now()}`,
      plate: data.plate,
      brand: data.brand,
      model: data.model,
      year: data.year,
      currentKm: data.currentKm,
      status: "Available",
      maintenance: {
        lastOilChangeKm: data.lastOilChangeKm,
        oilChangeIntervalKm: data.oilChangeIntervalKm,
        lastTireChangeDate: new Date(data.lastTireChangeDate).toISOString(),
        insuranceExpiryDate: new Date(data.insuranceExpiryDate).toISOString(),
      }
    };
    
    onAdd(newCar);
    setOpen(false);
    form.reset();
    toast({
      title: "Car added",
      description: `${newCar.brand} ${newCar.model} has been added to your fleet.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Car
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Vehicle</SheetTitle>
          <SheetDescription>
            Enter the details for the new car. It will be added to your fleet immediately.
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">General Info</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plate Number</FormLabel>
                      <FormControl>
                        <Input placeholder="XYZ-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Corolla" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Maintenance Metrics</h4>
              <FormField
                control={form.control}
                name="currentKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Odometer (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastOilChangeKm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Oil Change (km)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oilChangeIntervalKm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oil Interval (km)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastTireChangeDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Tire Change</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Expiry</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <SheetFooter>
              <Button type="submit" className="w-full">Save Vehicle</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
