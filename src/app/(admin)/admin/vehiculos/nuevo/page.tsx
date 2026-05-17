import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VehicleForm } from "@/components/admin/vehicles/vehicle-form";

export const metadata: Metadata = {
  title: "Nuevo vehículo",
};

export default function NewVehiclePage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/vehiculos"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="size-3" aria-hidden />
          Inventario
        </Link>
        <h1 className="font-display mt-2 text-3xl font-black tracking-tight">Nuevo vehículo</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Llena los datos para crear una nueva publicación. Las fotos las cargas después.
        </p>
      </div>

      <VehicleForm mode="create" />
    </div>
  );
}
