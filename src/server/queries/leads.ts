import "server-only";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leadNotes, leads } from "@/db/schema";

export type AdminLead = Awaited<ReturnType<typeof getAdminLeads>>[number];

export async function getAdminLeads() {
  return db.query.leads.findMany({
    orderBy: [desc(leads.createdAt)],
    with: {
      vehicle: {
        columns: { id: true, slug: true, brand: true, model: true, year: true, priceUsd: true },
      },
      notes: {
        orderBy: (n, { asc }) => [asc(n.createdAt)],
      },
    },
  });
}

export async function getUnreadLeadsCount(): Promise<number> {
  const [row] = await db.select({ count: count() }).from(leads).where(eq(leads.status, "new"));
  return row?.count ?? 0;
}

export async function getLatestNewLead() {
  return db.query.leads.findFirst({
    where: eq(leads.status, "new"),
    orderBy: [desc(leads.createdAt)],
    with: {
      vehicle: { columns: { brand: true, model: true, year: true } },
    },
  });
}

export type LeadNote = typeof leadNotes.$inferSelect;
