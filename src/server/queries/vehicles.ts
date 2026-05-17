import "server-only";
import { and, desc, eq, inArray, ne, or } from "drizzle-orm";
import { db } from "@/db";
import { vehicles } from "@/db/schema";

export type PublicVehicleListItem = Awaited<ReturnType<typeof getPublicVehicles>>[number];
export type VehicleDetail = NonNullable<Awaited<ReturnType<typeof getVehicleBySlug>>>;

const VISIBLE_STATUSES = ["published", "reserved"] as const;

export async function getPublicVehicles() {
  return db.query.vehicles.findMany({
    where: inArray(vehicles.status, VISIBLE_STATUSES),
    orderBy: [desc(vehicles.featured), desc(vehicles.createdAt)],
    with: {
      images: {
        where: (img, { eq }) => eq(img.isCover, true),
        limit: 1,
      },
    },
  });
}

export async function getFeaturedVehicles(limit = 4) {
  return db.query.vehicles.findMany({
    where: and(eq(vehicles.status, "published"), eq(vehicles.featured, true)),
    orderBy: [desc(vehicles.createdAt)],
    limit,
    with: {
      images: {
        where: (img, { eq }) => eq(img.isCover, true),
        limit: 1,
      },
    },
  });
}

export async function getVehicleBySlug(slug: string) {
  return db.query.vehicles.findFirst({
    where: and(eq(vehicles.slug, slug), inArray(vehicles.status, VISIBLE_STATUSES)),
    with: {
      images: {
        orderBy: (img, { asc }) => [asc(img.position)],
      },
    },
  });
}

export async function getRelatedVehicles(
  excludeId: string,
  brand: string,
  bodyType: PublicVehicleListItem["bodyType"],
  limit = 3,
) {
  return db.query.vehicles.findMany({
    where: and(
      ne(vehicles.id, excludeId),
      inArray(vehicles.status, VISIBLE_STATUSES),
      or(eq(vehicles.brand, brand), eq(vehicles.bodyType, bodyType)),
    ),
    orderBy: [desc(vehicles.featured), desc(vehicles.createdAt)],
    limit,
    with: {
      images: {
        where: (img, { eq }) => eq(img.isCover, true),
        limit: 1,
      },
    },
  });
}
