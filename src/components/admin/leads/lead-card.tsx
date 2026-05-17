"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { AddNoteForm } from "@/components/admin/leads/add-note-form";
import { LeadStatusBadge } from "@/components/admin/leads/lead-status-badge";
import { LeadStatusSelect } from "@/components/admin/leads/lead-status-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatUsd } from "@/lib/format";
import { whatsappLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import type { AdminLead } from "@/server/queries/leads";

type Props = {
  lead: AdminLead;
};

export function LeadCard({ lead }: Props) {
  const isUnread = lead.status === "new";
  const ago = formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: es });
  const vehicleLabel = lead.vehicle
    ? `${lead.vehicle.brand} ${lead.vehicle.model} ${lead.vehicle.year}`
    : null;

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          "group bg-card border-border/60 hover:border-brand-red/40 block w-full rounded-xl border p-4 text-left transition",
          isUnread && "ring-brand-red/20 ring-1",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <LeadStatusBadge status={lead.status} />
              <p className="text-foreground text-sm font-semibold">{lead.name}</p>
            </div>
            <p className="text-muted-foreground text-xs">
              {lead.phone}
              {lead.email ? ` · ${lead.email}` : ""}
            </p>
            {vehicleLabel && (
              <p className="text-foreground/80 text-xs">
                Interesado en <span className="font-semibold">{vehicleLabel}</span>
              </p>
            )}
            {lead.message && (
              <p className="text-muted-foreground line-clamp-1 text-xs italic">
                &ldquo;{lead.message}&rdquo;
              </p>
            )}
          </div>
          <span className="text-muted-foreground shrink-0 text-[11px] whitespace-nowrap">
            {ago}
          </span>
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 sm:max-w-lg">
        <SheetHeader className="border-border/60 border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <LeadStatusBadge status={lead.status} />
            <span className="text-muted-foreground text-xs">{ago}</span>
          </div>
          <SheetTitle className="font-display text-xl font-bold tracking-tight">
            {lead.name}
          </SheetTitle>
          <SheetDescription>Solicitud de información recibida desde el sitio.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <section className="space-y-3">
            <h3 className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Estado
            </h3>
            <LeadStatusSelect leadId={lead.id} status={lead.status} />
          </section>

          <section className="space-y-2">
            <h3 className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Contactar
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <a
                href={whatsappLink(
                  `Hola ${lead.name.split(" ")[0] ?? lead.name}, te contacto desde Autos Harry's sobre tu consulta.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border/60 hover:border-brand-red/40 hover:bg-muted/40 flex items-center gap-3 rounded-lg border p-3 text-sm transition"
              >
                <MessageCircle className="text-brand-red size-4 shrink-0" aria-hidden />
                <span className="flex-1 truncate">WhatsApp · {lead.phone}</span>
                <ExternalLink className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
              </a>
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="border-border/60 hover:border-brand-red/40 hover:bg-muted/40 flex items-center gap-3 rounded-lg border p-3 text-sm transition"
              >
                <Phone className="text-brand-red size-4 shrink-0" aria-hidden />
                <span className="flex-1 truncate">Llamar · {lead.phone}</span>
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="border-border/60 hover:border-brand-red/40 hover:bg-muted/40 flex items-center gap-3 rounded-lg border p-3 text-sm transition"
                >
                  <Mail className="text-brand-red size-4 shrink-0" aria-hidden />
                  <span className="flex-1 truncate">{lead.email}</span>
                </a>
              )}
            </div>
          </section>

          {lead.vehicle && (
            <section className="space-y-2">
              <h3 className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Vehículo de interés
              </h3>
              <Link
                href={`/vehiculos/${lead.vehicle.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border/60 hover:border-brand-red/40 hover:bg-muted/40 block rounded-lg border p-3 transition"
              >
                <p className="text-foreground text-sm font-semibold">{vehicleLabel}</p>
                <p className="text-brand-navy mt-0.5 text-sm font-bold">
                  {formatUsd(lead.vehicle.priceUsd)}
                </p>
              </Link>
            </section>
          )}

          {lead.message && (
            <section className="space-y-2">
              <h3 className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Mensaje
              </h3>
              <p className="bg-muted/40 text-foreground/90 rounded-lg p-3 text-sm leading-relaxed">
                {lead.message}
              </p>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Notas internas
            </h3>
            {lead.notes.length > 0 ? (
              <ul className="space-y-2">
                {lead.notes.map((n) => (
                  <li key={n.id} className="bg-muted/30 rounded-lg p-3 text-sm">
                    <p className="text-foreground whitespace-pre-wrap">{n.note}</p>
                    <p className="text-muted-foreground mt-1 text-[10px]">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-xs italic">Sin notas todavía.</p>
            )}
            <AddNoteForm leadId={lead.id} />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
