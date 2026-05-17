import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VehicleNotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">404</p>
      <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
        Este vehículo ya no está disponible
      </h1>
      <p className="text-muted-foreground max-w-md text-pretty">
        Quizás ya fue vendido o el enlace está roto. Echa un vistazo al resto del catálogo, seguro
        encuentras algo que te guste.
      </p>
      <Link
        href="/vehiculos"
        className="bg-brand-red text-brand-red-foreground inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver al catálogo
      </Link>
    </section>
  );
}
