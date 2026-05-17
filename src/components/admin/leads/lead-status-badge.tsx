import { LEAD_STATUS_LABELS, LEAD_STATUS_STYLES, type LeadStatus } from "@/lib/lead-status";
import { cn } from "@/lib/utils";

type Props = {
  status: LeadStatus;
  className?: string;
};

export function LeadStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
        LEAD_STATUS_STYLES[status],
        className,
      )}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
