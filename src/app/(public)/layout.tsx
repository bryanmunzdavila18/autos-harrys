import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-border/60 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Autos Harrys
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/vehiculos" className="text-muted-foreground hover:text-foreground">
              Catálogo
            </Link>
            <Link href="/contacto" className="text-muted-foreground hover:text-foreground">
              Contacto
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-border/60 border-t py-8">
        <div className="text-muted-foreground mx-auto max-w-6xl px-4 text-sm sm:px-6">
          © {new Date().getFullYear()} Autos Harrys. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}
