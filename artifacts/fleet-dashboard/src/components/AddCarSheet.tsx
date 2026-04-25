import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Car } from "../data/types";
import { useToast } from "../hooks/use-toast";
import { Separator } from "./ui/separator";

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
      title: "Vehicle added",
      description: `${newCar.brand} ${newCar.model} has been added to the fleet.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8 px-3">
          <Plus className="w-3.5 h-3.5" /> Add vehicle
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l sm:border-l sm:rounded-l-2xl pr-0">
        <div className="pr-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Add vehicle</SheetTitle>
            <SheetDescription>
              Enter the details for the new car.
            </SheetDescription>
          </SheetHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Plate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="XYZ-123" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Year</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Toyota" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Corolla" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Maintenance schedule</h4>
                <FormField
                  control={form.control}
                  name="currentKm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Current Odometer (km)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Last Oil Change (km)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Oil Interval (km)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Last Tire Change</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9" />
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
                        <FormLabel className="text-xs">Insurance Expiry</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <SheetFooter className="mt-8">
                <Button type="submit" className="w-full">Save vehicle</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}