import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Star } from "lucide-react";
import { DeleteVehicleButton } from "@/components/admin/vehicles/delete-vehicle-button";
import { VehicleStatusBadge } from "@/components/admin/vehicles/vehicle-status-badge";
import { bodyTypeLabel, formatMileage, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { VEHICLE_STATUSES, VEHICLE_STATUS_LABELS, type VehicleStatus } from "@/lib/vehicle";
import { getAdminVehicles } from "@/server/queries/admin-vehicles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vehículos",
};

export default async function AdminVehiclesPage() {
  const vehicles = await getAdminVehicles();

  const counts: Record<VehicleStatus, number> = {
    draft: 0,
    published: 0,
    reserved: 0,
    sold: 0,
    paused: 0,
  };
  for (const v of vehicles) counts[v.status] += 1;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">
            Inventario
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight">Vehículos</h1>
          <p className="text-muted-foreground text-sm">
            {vehicles.length === 0
              ? "Aún no hay vehículos cargados."
              : `${vehicles.length} ${vehicles.length === 1 ? "vehículo" : "vehículos"} en el inventario.`}
          </p>
        </div>
        <Link
          href="/admin/vehiculos/nuevo"
          className="bg-brand-red text-brand-red-foreground inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md shadow-red-900/10 transition hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden />
          Nuevo vehículo
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {VEHICLE_STATUSES.map((s) => (
          <div key={s} className="bg-card border-border/60 rounded-xl border p-3">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              {VEHICLE_STATUS_LABELS[s]}
            </p>
            <p className="font-display mt-1 text-2xl font-black tracking-tight">{counts[s]}</p>
          </div>
        ))}
      </div>

      {vehicles.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="bg-card border-border/60 divide-border/60 divide-y overflow-hidden rounded-xl border">
          {vehicles.map((v) => {
            const cover = v.images[0];
            const label = `${v.brand} ${v.model} ${v.year}`;
            return (
              <li
                key={v.id}
                className="hover:bg-muted/30 flex flex-wrap items-center gap-4 p-4 transition"
              >
                <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg">
                  {cover && (
                    <Image
                      src={cover.url}
                      alt={cover.alt ?? label}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-foreground truncate text-sm font-semibold">{label}</p>
                    <VehicleStatusBadge status={v.status} />
                    {v.featured && (
                      <span className="text-brand-red inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase">
                        <Star className="size-3 fill-current" aria-hidden />
                        Destacado
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {bodyTypeLabel(v.bodyType)} · {formatMileage(v.mileageKm)}
                    {v.color ? ` · ${v.color}` : ""}
                  </p>
                </div>

                <p className="text-brand-navy font-display text-base font-bold tracking-tight">
                  {formatUsd(v.priceUsd)}
                </p>

                <div className="flex shrink-0 items-center gap-1">
                  {v.status === "published" && (
                    <Link
                      href={`/vehiculos/${v.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ver en el sitio público"
                      className={cn(
                        "text-muted-foreground hover:text-foreground hover:bg-muted",
                        "inline-flex size-9 items-center justify-center rounded-lg transition",
                      )}
                    >
                      <ExternalLink className="size-4" aria-hidden />
                    </Link>
                  )}
                  <Link
                    href={`/admin/vehiculos/${v.id}/editar`}
                    aria-label="Editar vehículo"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-lg transition"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                  <DeleteVehicleButton vehicleId={v.id} vehicleLabel={label} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border/60 rounded-2xl border border-dashed p-16 text-center">
      <p className="text-foreground font-display text-lg font-bold">Empieza tu inventario</p>
      <p className="text-muted-foreground mt-1 text-sm">
        Carga el primer vehículo para que aparezca en el catálogo.
      </p>
      <Link
        href="/admin/vehiculos/nuevo"
        className="bg-brand-red text-brand-red-foreground mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
      >
        <Plus className="size-4" aria-hidden />
        Crear vehículo
      </Link>
    </div>
  );
}
