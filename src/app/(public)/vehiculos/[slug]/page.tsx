import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Fuel,
  Gauge,
  Mail,
  MessageCircle,
  Settings2,
} from "lucide-react";
import { FinancingCalculator } from "@/components/features/vehicle/financing-calculator";
import { VehicleCard } from "@/components/features/vehicle/vehicle-card";
import { VehicleGallery } from "@/components/features/vehicle/vehicle-gallery";
import { VehicleJsonLd } from "@/components/features/vehicle/vehicle-jsonld";
import { Badge } from "@/components/ui/badge";
import { CONTACT, whatsappLink } from "@/lib/contact";
import { env } from "@/lib/env";
import {
  bodyTypeLabel,
  formatMileage,
  formatUsd,
  fuelLabel,
  transmissionLabel,
} from "@/lib/format";
import { getRelatedVehicles, getVehicleBySlug } from "@/server/queries/vehicles";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) return { title: "Vehículo no encontrado" };

  const label = `${v.brand} ${v.model} ${v.year}`;
  const description = `${label} en ${formatUsd(v.priceUsd)} — ${v.color ?? ""}, ${formatMileage(
    v.mileageKm,
  )}, ${transmissionLabel(v.transmission)}.`;

  return {
    title: label,
    description,
    openGraph: {
      title: `${label} — Autos Harry's`,
      description,
      type: "website",
      images: v.images[0] ? [{ url: v.images[0].url }] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) notFound();

  const related = await getRelatedVehicles(v.id, v.brand, v.bodyType, 3);
  const vehicleLabel = `${v.brand} ${v.model} ${v.year}`;
  const canonicalUrl = `${env.NEXT_PUBLIC_SITE_URL}/vehiculos/${v.slug}`;
  const whatsappMessage = `Hola, me interesa el ${vehicleLabel} de ${formatUsd(v.priceUsd)}. ¿Está disponible?`;
  const mailSubject = `Consulta: ${vehicleLabel}`;
  const mailBody = `Hola, vi el ${vehicleLabel} en su sitio y me gustaría más información. Gracias.`;

  return (
    <>
      <VehicleJsonLd vehicle={v} url={canonicalUrl} />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/vehiculos"
            className="bg-brand-red text-brand-red-foreground inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide uppercase shadow-sm transition hover:opacity-90"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver al catálogo
          </Link>
          <nav
            aria-label="Breadcrumb"
            className="text-muted-foreground hidden flex-wrap items-center gap-1.5 text-xs sm:flex"
          >
            <Link href="/" className="hover:text-foreground transition">
              Inicio
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <Link href="/vehiculos" className="hover:text-foreground transition">
              Catálogo
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-foreground font-medium">{vehicleLabel}</span>
          </nav>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <VehicleGallery images={v.images} vehicleLabel={vehicleLabel} />
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {v.featured && (
                  <Badge className="bg-brand-red text-brand-red-foreground">Destacado</Badge>
                )}
                {v.status === "reserved" && (
                  <Badge variant="outline" className="border-amber-500 text-amber-700">
                    Reservado
                  </Badge>
                )}
                <Badge variant="outline">{bodyTypeLabel(v.bodyType)}</Badge>
              </div>
              <h1 className="font-display text-3xl leading-tight font-black tracking-tight sm:text-4xl">
                {v.brand} <span className="text-foreground/85">{v.model}</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-base">
                {v.year}
                {v.color ? ` · ${v.color}` : ""}
              </p>
            </div>

            <p className="text-brand-navy font-display text-4xl leading-none font-extrabold tracking-tight">
              {formatUsd(v.priceUsd)}
            </p>

            <dl className="border-border/60 grid grid-cols-2 gap-4 border-y py-4 text-sm">
              <SpecItem
                icon={<Calendar className="text-brand-red size-4" aria-hidden />}
                label="Año"
                value={String(v.year)}
              />
              <SpecItem
                icon={<Gauge className="text-brand-red size-4" aria-hidden />}
                label="Kilometraje"
                value={formatMileage(v.mileageKm)}
              />
              <SpecItem
                icon={<Settings2 className="text-brand-red size-4" aria-hidden />}
                label="Transmisión"
                value={transmissionLabel(v.transmission)}
              />
              <SpecItem
                icon={<Fuel className="text-brand-red size-4" aria-hidden />}
                label="Combustible"
                value={fuelLabel(v.fuel)}
              />
            </dl>

            <div className="space-y-2">
              {CONTACT.hasWhatsapp ? (
                <a
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-red text-brand-red-foreground inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold shadow-md shadow-red-900/10 transition hover:opacity-90"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Cotizar por WhatsApp
                </a>
              ) : null}
              <a
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                className="border-brand-navy/20 bg-background text-brand-navy hover:bg-brand-navy/5 inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition"
              >
                <Mail className="size-4" aria-hidden />
                Enviar consulta por email
              </a>
            </div>

            <FinancingCalculator priceUsd={v.priceUsd} />
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-3 lg:col-span-2">
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Ficha técnica
            </h2>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
              <DetailRow label="Marca" value={v.brand} />
              <DetailRow label="Modelo" value={v.model} />
              <DetailRow label="Año" value={String(v.year)} />
              <DetailRow label="Kilometraje" value={formatMileage(v.mileageKm)} />
              <DetailRow label="Transmisión" value={transmissionLabel(v.transmission)} />
              <DetailRow label="Combustible" value={fuelLabel(v.fuel)} />
              <DetailRow label="Tipo" value={bodyTypeLabel(v.bodyType)} />
              {v.color && <DetailRow label="Color" value={v.color} />}
            </dl>
          </div>

          {v.description && (
            <div className="space-y-3 lg:col-span-1">
              <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                Descripción
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">{v.description}</p>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-border/60 bg-secondary/30 border-t py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8">
              <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">
                Similares
              </p>
              <h2 className="font-display mt-1 text-2xl font-bold tracking-tight">
                También te puede interesar
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rv) => (
                <VehicleCard key={rv.id} vehicle={rv} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="shrink-0">{icon}</div>
      <div>
        <dt className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
          {label}
        </dt>
        <dd className="text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 flex justify-between border-b py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground font-medium">{value}</dd>
    </div>
  );
}
