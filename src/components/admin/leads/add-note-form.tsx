"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { addLeadNote } from "@/server/actions/leads";

type Props = {
  leadId: string;
};

export function AddNoteForm({ leadId }: Props) {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await addLeadNote({ leadId, note: trimmed });
      if (!result.ok) {
        toast.error("No pudimos guardar la nota", { description: result.error });
        return;
      }
      setNote("");
      toast.success("Nota agregada");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ej. Llamé al cliente, prefiere ver el carro el sábado..."
        rows={3}
        maxLength={2000}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || !note.trim()}
          className="bg-brand-navy text-brand-navy-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Send className="size-3.5" aria-hidden />
          )}
          {isPending ? "Guardando..." : "Agregar nota"}
        </button>
      </div>
    </form>
  );
}
