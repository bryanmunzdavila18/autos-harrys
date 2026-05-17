"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteVehicle } from "@/server/actions/vehicles";

type Props = {
  vehicleId: string;
  vehicleLabel: string;
  variant?: "icon" | "full";
};

export function DeleteVehicleButton({ vehicleId, vehicleLabel, variant = "icon" }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteVehicle({ id: vehicleId });
      if (result && !result.ok) {
        toast.error("No se pudo eliminar", { description: result.error });
        return;
      }
      // On success, server action redirects; no further code runs here.
    });
  };

  const triggerClass =
    variant === "icon"
      ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10 inline-flex size-9 items-center justify-center rounded-lg transition"
      : "text-destructive hover:bg-destructive/10 inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2.5 text-sm font-semibold transition";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClass} aria-label="Eliminar vehículo">
        <Trash2 className="size-4" aria-hidden />
        {variant === "full" && "Eliminar vehículo"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            Eliminar vehículo
          </DialogTitle>
          <DialogDescription>
            Vas a eliminar <span className="text-foreground font-semibold">{vehicleLabel}</span> y
            todas sus imágenes asociadas. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {isPending ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
