"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BODY_TYPES,
  FUELS,
  TRANSMISSIONS,
  VEHICLE_STATUSES,
  VEHICLE_STATUS_LABELS,
} from "@/lib/vehicle";
import { bodyTypeLabel, fuelLabel, transmissionLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { vehicleFormSchema, type VehicleFormInput } from "@/lib/validations/vehicle";
import { createVehicle, updateVehicle } from "@/server/actions/vehicles";

type Props =
  | { mode: "create"; defaultValues?: undefined; vehicleId?: undefined }
  | { mode: "edit"; vehicleId: string; defaultValues: VehicleFormInput };

export function VehicleForm(props: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<VehicleFormInput>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: props.defaultValues ?? {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      priceUsd: 0,
      mileageKm: 0,
      transmission: "manual",
      fuel: "gasoline",
      bodyType: "sedan",
      color: "",
      description: "",
      status: "draft",
      featured: false,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createVehicle(values)
          : await updateVehicle(props.vehicleId, values);

      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, msgs] of Object.entries(result.fieldErrors)) {
            const first = msgs?.[0];
            if (first) setError(field as keyof VehicleFormInput, { message: first });
          }
        }
        toast.error("No pudimos guardar", { description: result.error });
        return;
      }

      if (props.mode === "create" && "id" in result) {
        toast.success("Vehículo creado");
        router.push(`/admin/vehiculos/${result.id}/editar`);
        return;
      }

      toast.success("Cambios guardados");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <FormSection title="Identidad" description="Datos básicos del vehículo.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldText
            id="brand"
            label="Marca"
            required
            placeholder="Toyota"
            error={errors.brand?.message}
            {...register("brand")}
          />
          <FieldText
            id="model"
            label="Modelo"
            required
            placeholder="Hilux SRX"
            error={errors.model?.message}
            {...register("model")}
          />
          <FieldText
            id="year"
            label="Año"
            type="number"
            required
            error={errors.year?.message}
            {...register("year", { valueAsNumber: true })}
          />
          <FieldText
            id="color"
            label="Color"
            placeholder="Blanco perla"
            error={errors.color?.message}
            {...register("color")}
          />
        </div>
      </FormSection>

      <FormSection title="Especificaciones" description="Cómo viene equipado.">
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldSelect
            label="Transmisión"
            control={control}
            name="transmission"
            options={TRANSMISSIONS.map((t) => ({ value: t, label: transmissionLabel(t) }))}
            error={errors.transmission?.message}
          />
          <FieldSelect
            label="Combustible"
            control={control}
            name="fuel"
            options={FUELS.map((f) => ({ value: f, label: fuelLabel(f) }))}
            error={errors.fuel?.message}
          />
          <FieldSelect
            label="Tipo"
            control={control}
            name="bodyType"
            options={BODY_TYPES.map((t) => ({ value: t, label: bodyTypeLabel(t) }))}
            error={errors.bodyType?.message}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          <FieldText
            id="mileageKm"
            label="Kilometraje (km)"
            type="number"
            required
            error={errors.mileageKm?.message}
            {...register("mileageKm", { valueAsNumber: true })}
          />
        </div>
      </FormSection>

      <FormSection title="Precio y publicación" description="Cuánto cuesta y dónde se muestra.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldText
            id="priceUsd"
            label="Precio (USD)"
            type="number"
            required
            error={errors.priceUsd?.message}
            {...register("priceUsd", { valueAsNumber: true })}
          />
          <FieldSelect
            label="Estado"
            control={control}
            name="status"
            options={VEHICLE_STATUSES.map((s) => ({ value: s, label: VEHICLE_STATUS_LABELS[s] }))}
            error={errors.status?.message}
          />
        </div>
        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <ToggleField
              label="Destacar en la portada"
              description="Aparece en la sección de destacados del landing."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormSection>

      <FormSection title="Descripción" description="Texto que verá el cliente en el detalle.">
        <Textarea
          rows={6}
          placeholder="Toyota Hilux SRX 2022, doble cabina, asientos de cuero..."
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="text-destructive text-xs font-medium" role="alert">
            {errors.description.message}
          </p>
        )}
      </FormSection>

      <div className="border-border/60 flex flex-wrap items-center justify-end gap-3 border-t pt-6">
        <Link
          href="/admin/vehiculos"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-red text-brand-red-foreground inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-md shadow-red-900/10 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {isPending
            ? "Guardando..."
            : props.mode === "create"
              ? "Crear vehículo"
              : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <h2 className="font-display text-base font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
      </div>
      <div className="space-y-4 lg:col-span-2">{children}</div>
    </section>
  );
}

type FieldTextProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
};

const FieldText = (props: FieldTextProps) => {
  const { id, label, required, error, className, ...rest } = props;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-brand-red ml-0.5">*</span>}
      </Label>
      <Input id={id} aria-invalid={!!error} className={className} {...rest} />
      {error && (
        <p className="text-destructive text-xs font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

function FieldSelect<Name extends keyof VehicleFormInput>({
  label,
  control,
  name,
  options,
  error,
}: {
  label: string;
  control: Control<VehicleFormInput>;
  name: Name;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value as string}
            onValueChange={(next) => {
              if (next !== null) field.onChange(next);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-destructive text-xs font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="border-border/60 flex cursor-pointer items-start gap-3 rounded-lg border p-3 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
          checked ? "bg-brand-red" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow transition",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
      <div>
        <p className="text-foreground text-sm font-medium">{label}</p>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>
    </label>
  );
}
