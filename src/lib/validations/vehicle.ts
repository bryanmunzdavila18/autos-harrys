import { z } from "zod";
import { BODY_TYPES, FUELS, TRANSMISSIONS, VEHICLE_STATUSES } from "@/lib/vehicle";

const CURRENT_YEAR = new Date().getFullYear();

export const vehicleFormSchema = z.object({
  brand: z.string().trim().min(1, "La marca es obligatoria").max(60),
  model: z.string().trim().min(1, "El modelo es obligatorio").max(100),
  year: z
    .number({ message: "Año inválido" })
    .int("Año inválido")
    .min(1900, "Año demasiado antiguo")
    .max(CURRENT_YEAR + 2, "Año futuro inválido"),
  priceUsd: z
    .number({ message: "Precio inválido" })
    .int("Precio debe ser entero")
    .min(1, "Precio debe ser mayor a 0"),
  mileageKm: z
    .number({ message: "Kilometraje inválido" })
    .int("Kilometraje debe ser entero")
    .min(0, "Kilometraje no puede ser negativo"),
  transmission: z.enum(TRANSMISSIONS, { message: "Transmisión requerida" }),
  fuel: z.enum(FUELS, { message: "Combustible requerido" }),
  bodyType: z.enum(BODY_TYPES, { message: "Tipo requerido" }),
  color: z.string().trim().max(40, "Color demasiado largo").or(z.literal("")),
  description: z.string().trim().max(5000, "Descripción demasiado larga").or(z.literal("")),
  status: z.enum(VEHICLE_STATUSES),
  featured: z.boolean(),
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
