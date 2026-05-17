"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/features/lead/lead-form";

type Props = {
  vehicle?: { id: string; label: string };
  triggerLabel?: string;
};

export function LeadDialog({ vehicle, triggerLabel = "Solicitar más información" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border-brand-navy/20 bg-background text-brand-navy hover:bg-brand-navy/5 inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition">
        <Mail className="size-4" aria-hidden />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            Solicitar información
          </DialogTitle>
          <DialogDescription>
            Déjanos tus datos y un asesor te contacta en horario hábil.
          </DialogDescription>
        </DialogHeader>
        <LeadForm vehicle={vehicle} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
