import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
      <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
        Próximamente · Costa Rica
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
        Encuentra tu próximo carro en <span className="text-primary">Autos Harrys</span>.
      </h1>
      <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
        Catálogo de vehículos usados verificados, con financiamiento disponible. Compra fácil y
        transparente.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/vehiculos" className={buttonVariants({ size: "lg" })}>
          Ver catálogo
        </Link>
        <Link href="/contacto" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Contáctanos
        </Link>
      </div>
    </section>
  );
}
