"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/lead-status";
import { updateLeadStatus } from "@/server/actions/leads";

type Props = {
  leadId: string;
  status: LeadStatus;
};

export function LeadStatusSelect({ leadId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string | null) => {
    if (!next || next === status) return;
    startTransition(async () => {
      const result = await updateLeadStatus({
        id: leadId,
        status: next as LeadStatus,
      });
      if (!result.ok) {
        toast.error("No pudimos actualizar el estado", { description: result.error });
        return;
      }
      toast.success(`Estado actualizado a "${LEAD_STATUS_LABELS[next as LeadStatus]}"`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="text-muted-foreground size-4 animate-spin" aria-hidden />}
    </div>
  );
}
