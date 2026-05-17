export const LEAD_STATUSES = ["new", "contacted", "negotiating", "won", "lost"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  negotiating: "En negociación",
  won: "Cerrado · Ganado",
  lost: "Cerrado · Perdido",
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-brand-red text-white",
  contacted: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  negotiating: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  won: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  lost: "bg-muted text-muted-foreground",
};
