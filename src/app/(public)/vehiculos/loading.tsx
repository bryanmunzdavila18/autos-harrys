import { VehicleCardSkeleton } from "@/components/features/vehicle/vehicle-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehiclesLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-32" />
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
