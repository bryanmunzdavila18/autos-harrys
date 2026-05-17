import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DeleteVehicleButton } from "@/components/admin/vehicles/delete-vehicle-button";
import { VehicleForm } from "@/components/admin/vehicles/vehicle-form";
import { getAdminVehicleById } from "@/server/queries/admin-vehicles";

export const dynamic = "force-dynamic";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getAdminVehicleById(id);
  if (!vehicle) return { title: "Vehículo no encontrado" };
  return { title: `Editar ${vehicle.brand} ${vehicle.model}` };
}

export default async function EditVehiclePage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const vehicle = await getAdminVehicleById(id);
  if (!vehicle) notFound();

  const label = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/vehiculos"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="size-3" aria-hidden />
            Inventario
          </Link>
          <h1 className="font-display mt-2 text-3xl font-black tracking-tight">Editar vehículo</h1>
          <p className="text-muted-foreground mt-1 text-sm">{label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {vehicle.status === "published" && (
            <Link
              href={`/vehiculos/${vehicle.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border/60 text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
            >
              Ver público
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          )}
          <DeleteVehicleButton vehicleId={vehicle.id} vehicleLabel={label} variant="full" />
        </div>
      </div>

      <VehicleForm
        mode="edit"
        vehicleId={vehicle.id}
        defaultValues={{
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          priceUsd: vehicle.priceUsd,
          mileageKm: vehicle.mileageKm,
          transmission: vehicle.transmission,
          fuel: vehicle.fuel,
          bodyType: vehicle.bodyType,
          color: vehicle.color ?? "",
          description: vehicle.description ?? "",
          status: vehicle.status,
          featured: vehicle.featured,
        }}
      />
    </div>
  );
}
