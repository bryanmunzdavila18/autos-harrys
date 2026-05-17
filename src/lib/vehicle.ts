export const VEHICLE_STATUSES = ["draft", "published", "reserved", "sold", "paused"] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  reserved: "Reservado",
  sold: "Vendido",
  paused: "Pausado",
};

export const VEHICLE_STATUS_STYLES: Record<VehicleStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  reserved: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  sold: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  paused: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
};

export const TRANSMISSIONS = ["manual", "automatic", "cvt"] as const;
export const FUELS = ["gasoline", "diesel", "hybrid", "electric"] as const;
export const BODY_TYPES = ["sedan", "suv", "pickup", "hatchback", "coupe", "van", "other"] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
