import Link from "next/link";
import { Car, LayoutDashboard, MessageSquareText } from "lucide-react";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehiculos", label: "Vehículos", icon: Car },
  { href: "/admin/leads", label: "Solicitudes", icon: MessageSquareText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="border-border/60 bg-card hidden w-64 shrink-0 border-r lg:flex lg:flex-col">
        <div className="border-border/60 flex h-20 items-center border-b px-5">
          <Link href="/admin" aria-label="Autos Harry's — Admin" className="flex items-center">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-border/60 border-t p-4">
          <p className="text-muted-foreground text-xs">Panel administrativo</p>
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
