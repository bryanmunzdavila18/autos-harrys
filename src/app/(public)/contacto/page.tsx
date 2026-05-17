import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LeadForm } from "@/components/features/lead/lead-form";
import { CONTACT, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos para más información sobre cualquier vehículo de Autos Harry's.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">Contacto</p>
        <h1 className="font-display mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Estamos para asesorarte
        </h1>
        <p className="text-muted-foreground mt-3 text-base">
          Déjanos tus datos y un asesor te contacta. También puedes escribirnos directo por WhatsApp
          o llamarnos.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="bg-card border-border/60 rounded-2xl border p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          {CONTACT.hasWhatsapp && (
            <a
              href={whatsappLink("Hola, me interesa más información sobre Autos Harry's")}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border/60 hover:border-brand-red/40 group flex items-start gap-4 rounded-2xl border p-5 transition"
            >
              <div className="bg-brand-red/10 text-brand-red flex size-11 shrink-0 items-center justify-center rounded-full">
                <MessageCircle className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-display font-semibold">WhatsApp</p>
                <p className="text-muted-foreground text-sm">Respuesta rápida en horario hábil</p>
              </div>
            </a>
          )}

          {CONTACT.hasPhone && (
            <a
              href={`tel:${CONTACT.displayPhone.replace(/\s/g, "")}`}
              className="border-border/60 hover:border-brand-red/40 group flex items-start gap-4 rounded-2xl border p-5 transition"
            >
              <div className="bg-brand-red/10 text-brand-red flex size-11 shrink-0 items-center justify-center rounded-full">
                <Phone className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-display font-semibold">Teléfono</p>
                <p className="text-muted-foreground text-sm">{CONTACT.displayPhone}</p>
              </div>
            </a>
          )}

          <a
            href={`mailto:${CONTACT.email}`}
            className="border-border/60 hover:border-brand-red/40 group flex items-start gap-4 rounded-2xl border p-5 transition"
          >
            <div className="bg-brand-red/10 text-brand-red flex size-11 shrink-0 items-center justify-center rounded-full">
              <Mail className="size-5" aria-hidden />
            </div>
            <div>
              <p className="font-display font-semibold">Email</p>
              <p className="text-muted-foreground text-sm">{CONTACT.email}</p>
            </div>
          </a>

          <div className="border-border/60 grid gap-4 rounded-2xl border p-5">
            <div className="flex items-start gap-3">
              <MapPin className="text-brand-red mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-display font-semibold">Ubicación</p>
                <p className="text-muted-foreground text-sm">{CONTACT.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-brand-red mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-display font-semibold">Horario</p>
                <p className="text-muted-foreground text-sm">{CONTACT.hours}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
