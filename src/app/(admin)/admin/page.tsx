export default function AdminDashboardPage() {
  return (
    <div className="space-y-2">
      <p className="text-brand-red text-xs font-semibold tracking-widest uppercase">Dashboard</p>
      <h1 className="font-display text-3xl font-black tracking-tight">Hola, admin</h1>
      <p className="text-muted-foreground max-w-xl text-sm">
        Panel de administración de Autos Harry&apos;s. Próximamente: métricas de leads, vehículos
        publicados y conversión.
      </p>
    </div>
  );
}
