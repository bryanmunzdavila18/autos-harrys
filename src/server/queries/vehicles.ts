import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { vehicles } from "@/db/schema";

export type PublicVehicleListItem = Awaited<ReturnType<typeof getPublicVehicles>>[number];

export async function getPublicVehicles() {
  return db.query.vehicles.findMany({
    where: eq(vehicles.status, "published"),
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
