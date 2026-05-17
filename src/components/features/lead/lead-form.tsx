"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { leadFormSchema, type LeadFormInput } from "@/lib/validations/lead";
import { createLead } from "@/server/actions/leads";

type Props = {
  vehicle?: { id: string; label: string };
  onSuccess?: () => void;
};

export function LeadForm({ vehicle, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      vehicleId: vehicle?.id,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createLead(values);
      if (result.ok) {
        toast.success("¡Solicitud enviada!", {
          description: "Te contactaremos pronto. Gracias por escribir.",
        });
        reset({ name: "", phone: "", email: "", message: "", vehicleId: vehicle?.id });
        onSuccess?.();
        return;
      }
      if (result.fieldErrors) {
        for (const [field, msgs] of Object.entries(result.fieldErrors)) {
          const first = msgs?.[0];
          if (first) setError(field as keyof LeadFormInput, { message: first });
        }
      }
      toast.error("No pudimos enviar tu solicitud", { description: result.error });
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {vehicle && (
        <div className="bg-secondary/60 border-border/60 rounded-lg border p-3">
          <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            Consulta sobre
          </p>
          <p className="text-foreground mt-0.5 text-sm font-semibold">{vehicle.label}</p>
        </div>
      )}

      <Field id="name" label="Nombre completo" required error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Ej. Carlos Rodríguez"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="phone" label="Teléfono" required error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+505 8800 0000"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
      </div>

      <Field id="message" label="Mensaje" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={4}
          placeholder={
            vehicle
              ? `Hola, me interesa el ${vehicle.label}. ¿Está disponible?`
              : "¿En qué te podemos ayudar?"
          }
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      <input type="hidden" {...register("vehicleId")} />

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-red text-brand-red-foreground inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md shadow-red-900/10 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enviando...
          </>
        ) : (
          "Enviar solicitud"
        )}
      </button>

      <p className="text-muted-foreground text-center text-xs">
        Te responderemos por el medio que prefieras (teléfono o email).
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-brand-red ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className={cn("text-[12px] font-medium", "text-destructive")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
