"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { slugify, VEHICLE_STATUSES, type VehicleStatus } from "@/lib/vehicle";
import { vehicleFormSchema, type VehicleFormInput } from "@/lib/validations/vehicle";
import { getVehicleSlugConflict } from "@/server/queries/admin-vehicles";

type CreateVehicleResult =
  | { ok: true; id: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof VehicleFormInput, string[]>>;
    };

type UpdateVehicleResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof VehicleFormInput, string[]>>;
    };

type SimpleResult = { ok: true } | { ok: false; error: string };

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 2;
  while (await getVehicleSlugConflict(slug, excludeId)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

function buildSlugBase(data: { brand: string; model: string; year: number; color: string }) {
  const parts = [data.brand, data.model, String(data.year)];
  if (data.color) parts.push(data.color);
  return slugify(parts.join(" "));
}

function normalize(input: VehicleFormInput) {
  return {
    brand: input.brand.trim(),
    model: input.model.trim(),
    year: input.year,
    priceUsd: input.priceUsd,
    mileageKm: input.mileageKm,
    transmission: input.transmission,
    fuel: input.fuel,
    bodyType: input.bodyType,
    color: input.color.trim() || null,
    description: input.description.trim() || null,
    status: input.status,
    featured: input.featured,
  };
}

export async function createVehicle(input: VehicleFormInput): Promise<CreateVehicleResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "No autorizado" };
  }

  const parsed = vehicleFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Hay errores en el formulario",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = normalize(parsed.data);
  const base = buildSlugBase({
    brand: data.brand,
    model: data.model,
    year: data.year,
    color: data.color ?? "",
  });
  const slug = await generateUniqueSlug(base);

  try {
    const [inserted] = await db
      .insert(vehicles)
      .values({ ...data, slug })
      .returning({ id: vehicles.id });
    if (!inserted) {
      return { ok: false, error: "No se pudo crear el vehículo" };
    }
    revalidatePath("/admin/vehiculos");
    revalidatePath("/vehiculos");
    revalidatePath("/");
    return { ok: true, id: inserted.id };
  } catch (err) {
    console.error("Failed to create vehicle:", err);
    return { ok: false, error: "Error al guardar. Intenta de nuevo." };
  }
}

export async function updateVehicle(
  id: string,
  input: VehicleFormInput,
): Promise<UpdateVehicleResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "No autorizado" };
  }

  const parsed = vehicleFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Hay errores en el formulario",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = normalize(parsed.data);

  try {
    await db.update(vehicles).set(data).where(eq(vehicles.id, id));
    revalidatePath("/admin/vehiculos");
    revalidatePath(`/admin/vehiculos/${id}/editar`);
    revalidatePath("/vehiculos");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("Failed to update vehicle:", err);
    return { ok: false, error: "Error al guardar. Intenta de nuevo." };
  }
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function deleteVehicle(input: z.infer<typeof deleteSchema>): Promise<SimpleResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "No autorizado" };
  }

  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "ID inválido" };

  try {
    await db.delete(vehicles).where(eq(vehicles.id, parsed.data.id));
    revalidatePath("/admin/vehiculos");
    revalidatePath("/vehiculos");
    revalidatePath("/");
  } catch (err) {
    console.error("Failed to delete vehicle:", err);
    return { ok: false, error: "No se pudo eliminar" };
  }

  redirect("/admin/vehiculos");
}

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(VEHICLE_STATUSES),
});

export async function updateVehicleStatus(
  input: z.infer<typeof statusSchema>,
): Promise<SimpleResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "No autorizado" };
  }

  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos" };

  await db
    .update(vehicles)
    .set({ status: parsed.data.status as VehicleStatus })
    .where(eq(vehicles.id, parsed.data.id));
  revalidatePath("/admin/vehiculos");
  revalidatePath("/vehiculos");
  revalidatePath("/");
  return { ok: true };
}
