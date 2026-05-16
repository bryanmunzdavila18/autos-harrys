import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="border-border/60 hidden w-60 shrink-0 border-r p-6 lg:block">
        <Link href="/admin" className="text-lg font-semibold tracking-tight">
          Autos Harrys
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          <Link href="/admin" className="hover:bg-muted rounded-md px-3 py-2">
            Dashboard
          </Link>
          <Link href="/admin/vehiculos" className="hover:bg-muted rounded-md px-3 py-2">
            Vehículos
          </Link>
          <Link href="/admin/leads" className="hover:bg-muted rounded-md px-3 py-2">
            Solicitudes
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
