import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Tu nombre es muy corto").max(120, "Nombre demasiado largo"),
  phone: z
    .string()
    .trim()
    .min(7, "Teléfono inválido")
    .max(30, "Teléfono demasiado largo")
    .regex(/^[+\d\s\-()]+$/, "Solo dígitos, +, espacios y paréntesis"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(200, "Email demasiado largo")
    .or(z.literal("")),
  message: z.string().trim().max(2000, "Mensaje demasiado largo").or(z.literal("")),
  vehicleId: z.string().uuid().optional(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;
