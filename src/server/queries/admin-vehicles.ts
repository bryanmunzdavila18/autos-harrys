import "server-only";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { vehicles } from "@/db/schema";

export type AdminVehicle = Awaited<ReturnType<typeof getAdminVehicles>>[number];

export async function getAdminVehicles() {
  return db.query.vehicles.findMany({
    orderBy: [desc(vehicles.featured), desc(vehicles.updatedAt)],
    with: {
      images: {
        where: (img, { eq }) => eq(img.isCover, true),
        limit: 1,
      },
    },
  });
}

export async function getAdminVehicleById(id: string) {
  return db.query.vehicles.findFirst({
    where: eq(vehicles.id, id),
    with: {
      images: {
        orderBy: (img, { asc }) => [asc(img.position)],
      },
    },
  });
}

export async function getVehicleSlugConflict(slug: string, excludeId?: string) {
  const existing = await db.query.vehicles.findFirst({
    where: eq(vehicles.slug, slug),
    columns: { id: true },
  });
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}

export async function getVehiclesCount() {
  const [row] = await db.select({ count: count() }).from(vehicles);
  return row?.count ?? 0;
}
