import type { Metadata } from "next";
import { LeadCard } from "@/components/admin/leads/lead-card";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/lead-status";
import { getAdminLeads } from "@/server/queries/leads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solicitudes",
};

export default async function AdminLeadsPage() {
  const items = await getAdminLeads();

  const stats: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    negotiating: 0,
    won: 0,
    lost: 0,
  };
  for (const lead of items) {
    stats[lead.status] += 1;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">
          Solicitudes
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight">Bandeja de entrada</h1>
        <p className="text-muted-foreground text-sm">
          {items.length === 0
            ? "Aún no hay solicitudes."
            : `${items.length} ${items.length === 1 ? "solicitud" : "solicitudes"} en total.`}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {LEAD_STATUSES.map((status) => (
          <StatCard
            key={status}
            label={LEAD_STATUS_LABELS[status]}
            value={stats[status]}
            status={status}
          />
        ))}
      </div>

      {items.length === 0 ? (
        <div className="border-border/60 text-muted-foreground rounded-2xl border border-dashed py-20 text-center text-sm">
          Cuando un cliente envíe el formulario de contacto, aparecerá aquí.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, status }: { label: string; value: number; status: LeadStatus }) {
  const isNew = status === "new" && value > 0;
  return (
    <div
      className={`bg-card border-border/60 rounded-xl border p-3 ${isNew ? "ring-brand-red/30 ring-1" : ""}`}
    >
      <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        {label}
      </p>
      <p
        className={`font-display mt-1 text-2xl font-black tracking-tight ${isNew ? "text-brand-red" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}
