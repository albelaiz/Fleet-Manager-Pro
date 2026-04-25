import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useCars } from "../context/CarsContext";
import { useToast } from "../hooks/use-toast";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  plate: z.string().min(2, "Plate is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1990).max(2030),
  currentKm: z.coerce.number().min(0),
  oilChangeKm: z.coerce.number().min(0),
  tireChangeDate: z.string().min(1, "Required"),
  insuranceDate: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCarSheet() {
  const [open, setOpen] = useState(false);
  const { addCar } = useCars();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      currentKm: 0,
      oilChangeKm: 10000,
      tireChangeDate: "",
      insuranceDate: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    addCar({
      plate: data.plate.toUpperCase(),
      brand: data.brand,
      model: data.model,
      year: data.year,
      currentKm: data.currentKm,
      oilChangeKm: data.oilChangeKm,
      tireChangeDate: new Date(data.tireChangeDate).toISOString(),
      insuranceDate: new Date(data.insuranceDate).toISOString(),
    });

    setOpen(false);
    form.reset();
    toast({
      title: "Vehicle added",
      description: `${data.brand} ${data.model} added to the fleet.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8 px-3">
          <Plus className="w-3.5 h-3.5" /> Add vehicle
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto pr-0 glass-panel !bg-transparent border-l shadow-2xl">
        <div className="pr-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Add vehicle</SheetTitle>
            <SheetDescription>
              Enter details and maintenance thresholds for the new car.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vehicle details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Plate</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="XYZ-123"
                            {...field}
                            className="h-9"
                          />
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
                          <Input
                            placeholder="Toyota"
                            {...field}
                            className="h-9"
                          />
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
                          <Input
                            placeholder="Corolla"
                            {...field}
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Maintenance thresholds
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Current km
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oilChangeKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Oil change at km
                        </FormLabel>
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
                    name="tireChangeDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Tire change date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="insuranceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Insurance expiry
                        </FormLabel>
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
                <Button type="submit" className="w-full">
                  Save vehicle
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
