import { VEHICLE_STATUS_LABELS, VEHICLE_STATUS_STYLES, type VehicleStatus } from "@/lib/vehicle";
import { cn } from "@/lib/utils";

type Props = {
  status: VehicleStatus;
  className?: string;
};

export function VehicleStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
        VEHICLE_STATUS_STYLES[status],
        className,
      )}
    >
      {VEHICLE_STATUS_LABELS[status]}
    </span>
  );
}
