"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, vehicles } from "@/db/schema";
import { formatUsd } from "@/lib/format";
import { sendTelegramNotification } from "@/lib/telegram";
import { leadFormSchema, type LeadFormInput } from "@/lib/validations/lead";

type CreateLeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof LeadFormInput, string[]>> };

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

  return { ok: true };
}
