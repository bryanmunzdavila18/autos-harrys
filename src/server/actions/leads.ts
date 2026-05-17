"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leadNotes, leads, vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatUsd } from "@/lib/format";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/lead-status";
import { sendTelegramNotification } from "@/lib/telegram";
import { leadFormSchema, type LeadFormInput } from "@/lib/validations/lead";

type CreateLeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof LeadFormInput, string[]>> };

type ActionResult = { ok: true } | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return ch;
    }
  });
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createLead(input: LeadFormInput): Promise<CreateLeadResult> {
  const parsed = leadFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Hay errores en el formulario",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;

  let vehicleLabel: string | null = null;
  if (data.vehicleId) {
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, data.vehicleId),
      columns: { brand: true, model: true, year: true, priceUsd: true, slug: true },
    });
    if (vehicle) {
      vehicleLabel = `${vehicle.brand} ${vehicle.model} ${vehicle.year} (${formatUsd(vehicle.priceUsd)})`;
    }
  }

  try {
    await db.insert(leads).values({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      vehicleId: data.vehicleId ?? null,
      source: "website",
    });
  } catch (err) {
    console.error("Failed to insert lead:", err);
    return { ok: false, error: "No pudimos guardar tu solicitud. Intenta de nuevo." };
  }

  const lines = [
    "<b>🚗 Nueva solicitud — Autos Harry's</b>",
    "",
    `<b>Nombre:</b> ${escapeHtml(data.name)}`,
    `<b>Teléfono:</b> ${escapeHtml(data.phone)}`,
  ];
  if (data.email) lines.push(`<b>Email:</b> ${escapeHtml(data.email)}`);
  if (vehicleLabel) lines.push(`<b>Vehículo:</b> ${escapeHtml(vehicleLabel)}`);
  if (data.message) lines.push("", `<i>${escapeHtml(data.message)}</i>`);

  await sendTelegramNotification(lines.join("\n")).catch((err) => {
    console.error("Telegram notification failed:", err);
  });

  revalidatePath("/admin", "layout");
  return { ok: true };
}

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});

export async function updateLeadStatus(
  input: z.infer<typeof updateStatusSchema>,
): Promise<ActionResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "No autorizado" };
  }

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos" };

  await db
    .update(leads)
    .set({ status: parsed.data.status as LeadStatus })
    .where(eq(leads.id, parsed.data.id));

  revalidatePath("/admin", "layout");
  return { ok: true };
}

const addNoteSchema = z.object({
  leadId: z.string().uuid(),
  note: z.string().trim().min(1, "Nota vacía").max(2000),
});

export async function addLeadNote(input: z.infer<typeof addNoteSchema>): Promise<ActionResult> {
  try {
    await requireSession();
  } catch {
    return { ok: false, error: "No autorizado" };
  }

  const parsed = addNoteSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  await db.insert(leadNotes).values({
    leadId: parsed.data.leadId,
    note: parsed.data.note,
  });

  revalidatePath("/admin/leads");
  return { ok: true };
}
