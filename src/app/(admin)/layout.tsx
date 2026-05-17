import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Car, LayoutDashboard, MessageSquareText } from "lucide-react";
import { LeadNotificationPoller } from "@/components/admin/lead-notification-poller";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Logo } from "@/components/logo";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getUnreadLeadsCount } from "@/server/queries/leads";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/admin/vehiculos", label: "Vehículos", icon: Car, key: "vehicles" },
  { href: "/admin/leads", label: "Solicitudes", icon: MessageSquareText, key: "leads" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const unreadCount = await getUnreadLeadsCount();

  return (
    <div className="flex min-h-full flex-1">
      <LeadNotificationPoller initialCount={unreadCount} />

      <aside className="border-border/60 bg-card hidden w-64 shrink-0 border-r lg:flex lg:flex-col">
        <div className="border-border/60 flex h-20 items-center border-b px-5">
          <Link href="/admin" aria-label="Autos Harry's — Admin" className="flex items-center">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const badgeCount = item.key === "leads" ? unreadCount : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
              >
                <Icon className="size-4" aria-hidden />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span
                    className={cn(
                      "bg-brand-red text-brand-red-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                    )}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-border/60 space-y-1 border-t p-3">
          <div className="px-3 py-2">
            <p className="text-foreground text-sm font-semibold">{session.user.name}</p>
            <p className="text-muted-foreground truncate text-xs">{session.user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
