import { useState } from "react";
import { useTranslation } from "react-i18next";
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

export function AddCarSheet() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { addCar } = useCars();
  const { toast } = useToast();

  const formSchema = z.object({
    plate: z.string().min(2, t("addCar.errors.plate")),
    brand: z.string().min(1, t("addCar.errors.brand")),
    model: z.string().min(1, t("addCar.errors.model")),
    year: z.coerce.number().min(1990).max(2030),
    currentKm: z.coerce.number().min(0),
    oilChangeKm: z.coerce.number().min(0),
    tireChangeDate: z.string().min(1, t("addCar.errors.required")),
    insuranceDate: z.string().min(1, t("addCar.errors.required")),
  });

  type FormValues = z.infer<typeof formSchema>;

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
      title: t("addCar.added"),
      description: t("addCar.addedDescription", {
        brand: data.brand,
        model: data.model,
      }),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8 px-3">
          <Plus className="w-3.5 h-3.5" /> {t("header.addVehicle")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto pe-0 glass-panel !bg-transparent shadow-2xl">
        <div className="pe-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">{t("addCar.title")}</SheetTitle>
            <SheetDescription>{t("addCar.description")}</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("addCar.vehicleDetails")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("addCar.plate")}
                        </FormLabel>
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
                        <FormLabel className="text-xs">
                          {t("addCar.year")}
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
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("addCar.brand")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
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
                        <FormLabel className="text-xs">
                          {t("addCar.model")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
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
                  {t("addCar.thresholds")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {t("addCar.currentKm")}
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
                          {t("addCar.oilChangeKm")}
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
                          {t("addCar.tireChangeDate")}
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
                          {t("addCar.insuranceDate")}
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
                  {t("addCar.save")}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
