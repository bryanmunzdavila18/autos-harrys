import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { CONTACT, whatsappLink } from "@/lib/contact";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-border/60 supports-[backdrop-filter]:bg-background/75 bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Autos Harry's — Inicio" className="flex shrink-0 items-center">
            <Logo className="h-14 w-auto sm:h-16" priority />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold tracking-wide uppercase md:flex">
            <Link
              href="/vehiculos"
              className="hover:text-brand-red text-foreground/80 transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/contacto"
              className="hover:text-brand-red text-foreground/80 transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {CONTACT.hasWhatsapp ? (
            <a
              href={whatsappLink("Hola, vi su sitio web de Autos Harry's")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-red text-brand-red-foreground inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90 focus-visible:ring-3 focus-visible:ring-current/40 focus-visible:outline-none"
            >
              <MessageCircle className="size-4" aria-hidden />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : (
            <Link
              href="/contacto"
              className="bg-brand-navy text-brand-navy-foreground inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90"
            >
              Contáctanos
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-border/60 border-t">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:gap-16">
          <div className="space-y-4">
            <Logo className="h-20 w-auto" />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Catálogo de vehículos usados verificados con financiamiento. Tu mejor elección en
              Managua.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="text-foreground font-display text-base font-semibold">Visítanos</h3>
            <ul className="text-muted-foreground space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="text-brand-red mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="text-brand-red mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="text-foreground font-display text-base font-semibold">Contacto</h3>
            <ul className="text-muted-foreground space-y-2.5">
              {CONTACT.hasWhatsapp && (
                <li>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-red flex items-center gap-2.5 transition-colors"
                  >
                    <MessageCircle className="text-brand-red size-4 shrink-0" aria-hidden />
                    WhatsApp
                  </a>
                </li>
              )}
              {CONTACT.hasPhone && (
                <li>
                  <a
                    href={`tel:${CONTACT.displayPhone.replace(/\s/g, "")}`}
                    className="hover:text-brand-red flex items-center gap-2.5 transition-colors"
                  >
                    <Phone className="text-brand-red size-4 shrink-0" aria-hidden />
                    {CONTACT.displayPhone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-brand-red flex items-center gap-2.5 transition-colors"
                >
                  <Mail className="text-brand-red size-4 shrink-0" aria-hidden />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border/60 border-t">
          <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© {new Date().getFullYear()} Autos Harry&apos;s. Todos los derechos reservados.</p>
            <p className="font-script text-brand-navy text-base">Mi mejor elección</p>
          </div>
        </div>
      </footer>
    </>
  );
}
