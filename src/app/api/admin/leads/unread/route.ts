import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLatestNewLead, getUnreadLeadsCount } from "@/server/queries/leads";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [count, latest] = await Promise.all([getUnreadLeadsCount(), getLatestNewLead()]);

  return NextResponse.json({
    count,
    latest: latest
      ? {
          id: latest.id,
          name: latest.name,
          createdAt: latest.createdAt,
          vehicleLabel: latest.vehicle
            ? `${latest.vehicle.brand} ${latest.vehicle.model} ${latest.vehicle.year}`
            : null,
        }
      : null,
  });
}
