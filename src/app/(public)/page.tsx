import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import { HeroVehicle } from "@/components/features/hero-vehicle";
import { VehicleCard } from "@/components/features/vehicle/vehicle-card";
import { CONTACT, whatsappLink } from "@/lib/contact";
import { getFeaturedVehicles } from "@/server/queries/vehicles";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const featured = await getFeaturedVehicles(4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="from-background via-background to-secondary/40 absolute inset-0 -z-10 bg-gradient-to-b"
          aria-hidden
        />
        <div
          className="bg-brand-red/10 absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="bg-brand-navy/15 absolute -bottom-40 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
          aria-hidden
        />

        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-24 lg:grid-cols-12 lg:gap-10 lg:pt-28 lg:pb-32">
          <div className="lg:col-span-6 lg:text-left">
            <span className="font-script text-brand-navy mb-2 block text-3xl sm:text-4xl">
              Mi mejor elección
            </span>
            <h1 className="font-display text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Encuentra tu próximo carro en{" "}
              <span className="text-brand-red">Autos Harry&apos;s</span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
              Catálogo de vehículos usados verificados, con opciones de financiamiento. Atención
              personalizada en Managua.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/vehiculos"
                className="bg-brand-red text-brand-red-foreground inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md shadow-red-900/10 transition hover:opacity-90"
              >
                Ver catálogo
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              {CONTACT.hasWhatsapp && (
                <a
                  href={whatsappLink("Hola, me interesa ver vehículos de su catálogo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-brand-navy/20 bg-background text-brand-navy hover:bg-brand-navy/5 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Escríbenos por WhatsApp
                </a>
              )}
            </div>

            <dl className="border-border/60 divide-border/60 mt-10 grid max-w-md grid-cols-3 divide-x border-t border-b py-4 text-center lg:text-left">
              <div className="px-2 lg:pl-0">
                <dt className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Inventario
                </dt>
                <dd className="font-display text-brand-navy mt-1 text-2xl font-bold">10+</dd>
              </div>
              <div className="px-2">
                <dt className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Marcas
                </dt>
                <dd className="font-display text-brand-navy mt-1 text-2xl font-bold">7</dd>
              </div>
              <div className="px-2">
                <dt className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Años
                </dt>
                <dd className="font-display text-brand-navy mt-1 text-2xl font-bold">2019+</dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div
              className="bg-brand-red/15 absolute -top-12 -right-6 h-40 w-40 rounded-full blur-2xl"
              aria-hidden
            />
            <div
              className="bg-brand-navy/20 absolute -bottom-12 -left-6 h-40 w-40 rounded-full blur-2xl"
              aria-hidden
            />
            <HeroVehicle className="relative drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">
                Destacados
              </p>
              <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Vehículos seleccionados para ti
              </h2>
            </div>
            <Link
              href="/vehiculos"
              className="text-brand-navy hover:text-brand-red hidden items-center gap-1 text-sm font-semibold transition sm:inline-flex"
            >
              Ver todo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/vehiculos"
              className="text-brand-navy hover:text-brand-red inline-flex items-center gap-1 text-sm font-semibold transition"
            >
              Ver todo el catálogo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      <section className="bg-secondary/40 border-border/60 border-y py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">
              ¿Por qué Autos Harry&apos;s?
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Compra con confianza
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <ValueCard
              icon={<ShieldCheck className="size-6" aria-hidden />}
              title="Vehículos verificados"
              description="Cada unidad pasa por inspección mecánica y revisión documental antes de publicarse."
            />
            <ValueCard
              icon={<Wallet className="size-6" aria-hidden />}
              title="Financiamiento disponible"
              description="Aplicamos a financiamientos bancarios con planes que se acomodan a tu presupuesto."
            />
            <ValueCard
              icon={<BadgeCheck className="size-6" aria-hidden />}
              title="Atención personalizada"
              description="Te acompañamos en todo el proceso: prueba de manejo, papeleo y entrega."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background border-border/60 rounded-xl border p-6">
      <div className="bg-brand-red/10 text-brand-red mb-4 inline-flex size-12 items-center justify-center rounded-full">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
