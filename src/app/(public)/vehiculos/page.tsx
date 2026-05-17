import type { Metadata } from "next";
import { VehicleCard } from "@/components/features/vehicle/vehicle-card";
import { getPublicVehicles } from "@/server/queries/vehicles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora todos los vehículos disponibles en Autos Harry's.",
};

export default async function VehiclesPage() {
  const items = await getPublicVehicles();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 flex flex-col gap-2">
        <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">Catálogo</p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Vehículos disponibles
          </h1>
          <p className="text-muted-foreground text-sm">
            {items.length} {items.length === 1 ? "vehículo disponible" : "vehículos disponibles"}
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="border-border/60 text-muted-foreground rounded-2xl border border-dashed py-24 text-center text-sm">
          Aún no hay vehículos publicados. Vuelve pronto.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </section>
  );
}
