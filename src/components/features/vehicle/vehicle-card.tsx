import Image from "next/image";
import Link from "next/link";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import {
  bodyTypeLabel,
  formatMileage,
  formatUsd,
  fuelLabel,
  transmissionLabel,
} from "@/lib/format";
import type { PublicVehicleListItem } from "@/server/queries/vehicles";

type Props = {
  vehicle: PublicVehicleListItem;
};

export function VehicleCard({ vehicle }: Props) {
  const cover = vehicle.images[0];

  return (
    <Link
      href={`/vehiculos/${vehicle.slug}`}
      className="group bg-card border-border/60 hover:border-brand-red/40 hover:shadow-brand-red/5 focus-visible:ring-brand-red/40 relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-3 focus-visible:outline-none"
    >
      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? `${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            Sin imagen
          </div>
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {vehicle.featured ? (
            <span className="bg-brand-red text-brand-red-foreground inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm">
              Destacado
            </span>
          ) : (
            <span />
          )}
          <span className="bg-background/90 text-foreground inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase shadow-sm backdrop-blur">
            {bodyTypeLabel(vehicle.bodyType)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-foreground text-base leading-tight font-bold tracking-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {vehicle.year} · {vehicle.color}
          </p>
        </div>

        <p className="text-brand-navy text-2xl leading-none font-extrabold tracking-tight">
          {formatUsd(vehicle.priceUsd)}
        </p>

        <dl className="text-muted-foreground border-border/60 mt-auto grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="text-brand-red size-3.5" aria-hidden />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="text-brand-red size-3.5" aria-hidden />
            <span>{formatMileage(vehicle.mileageKm)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="text-brand-red size-3.5" aria-hidden />
            <span>{transmissionLabel(vehicle.transmission)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="text-brand-red size-3.5" aria-hidden />
            <span>{fuelLabel(vehicle.fuel)}</span>
          </div>
        </dl>
      </div>
    </Link>
  );
}
