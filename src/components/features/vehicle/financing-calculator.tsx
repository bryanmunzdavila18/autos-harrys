"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatUsd } from "@/lib/format";

type Props = {
  priceUsd: number;
};

const PRIMA_OPTIONS = [10, 20, 30, 40, 50] as const;
const PLAZO_OPTIONS = [24, 36, 48, 60, 72] as const;
const TASA_OPTIONS = [10, 12, 14, 16, 18] as const;

function calculateMonthly(principal: number, monthlyRate: number, months: number) {
  if (monthlyRate === 0) return principal / months;
  const compounded = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * compounded) / (compounded - 1);
}

export function FinancingCalculator({ priceUsd }: Props) {
  const [primaPct, setPrimaPct] = useState<number>(20);
  const [plazoMeses, setPlazoMeses] = useState<number>(60);
  const [tasaAnual, setTasaAnual] = useState<number>(15);

  const { downPayment, financed, monthly, totalPaid } = useMemo(() => {
    const down = priceUsd * (primaPct / 100);
    const principal = priceUsd - down;
    const monthlyRate = tasaAnual / 12 / 100;
    const m = calculateMonthly(principal, monthlyRate, plazoMeses);
    return {
      downPayment: down,
      financed: principal,
      monthly: m,
      totalPaid: down + m * plazoMeses,
    };
  }, [priceUsd, primaPct, plazoMeses, tasaAnual]);

  return (
    <div className="bg-card border-border/60 space-y-4 rounded-2xl border p-5">
      <div className="flex items-center gap-2">
        <div className="bg-brand-red/10 text-brand-red flex size-9 items-center justify-center rounded-full">
          <Calculator className="size-4" aria-hidden />
        </div>
        <h3 className="font-display text-base font-bold tracking-tight">
          Calculadora de financiamiento
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <FieldSelect
          label="Prima"
          value={String(primaPct)}
          onChange={(v) => setPrimaPct(Number(v))}
          options={PRIMA_OPTIONS.map((v) => ({ value: String(v), label: `${v}%` }))}
        />
        <FieldSelect
          label="Plazo"
          value={String(plazoMeses)}
          onChange={(v) => setPlazoMeses(Number(v))}
          options={PLAZO_OPTIONS.map((v) => ({ value: String(v), label: `${v} meses` }))}
        />
        <FieldSelect
          label="Tasa anual"
          value={String(tasaAnual)}
          onChange={(v) => setTasaAnual(Number(v))}
          options={TASA_OPTIONS.map((v) => ({ value: String(v), label: `${v}%` }))}
        />
      </div>

      <div className="bg-brand-navy text-brand-navy-foreground -mx-5 -mb-5 rounded-b-2xl p-5">
        <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Cuota mensual</p>
        <p className="font-display mt-1 text-3xl font-black tracking-tight">{formatUsd(monthly)}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/85">
          <div>
            <dt className="text-white/60">Prima inicial</dt>
            <dd className="font-semibold text-white">{formatUsd(downPayment)}</dd>
          </div>
          <div>
            <dt className="text-white/60">Monto a financiar</dt>
            <dd className="font-semibold text-white">{formatUsd(financed)}</dd>
          </div>
          <div>
            <dt className="text-white/60">Total a pagar</dt>
            <dd className="font-semibold text-white">{formatUsd(totalPaid)}</dd>
          </div>
          <div>
            <dt className="text-white/60">Intereses</dt>
            <dd className="font-semibold text-white">{formatUsd(totalPaid - priceUsd)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-[11px] leading-relaxed text-white/55">
          Cálculo estimado con cuota fija. Las condiciones reales dependen del banco y tu perfil
          crediticio.
        </p>
      </div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next !== null) onChange(next);
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
    </label>
  );
}
