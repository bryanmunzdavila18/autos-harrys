const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const kmFormatter = new Intl.NumberFormat("es-NI");

export function formatUsd(amount: number): string {
  return usdFormatter.format(amount);
}

export function formatMileage(km: number): string {
  return `${kmFormatter.format(km)} km`;
}

export function formatYear(year: number): string {
  return year.toString();
}

const transmissionLabels: Record<string, string> = {
  manual: "Manual",
  automatic: "Automático",
  cvt: "CVT",
};

const fuelLabels: Record<string, string> = {
  gasoline: "Gasolina",
  diesel: "Diésel",
  hybrid: "Híbrido",
  electric: "Eléctrico",
};

const bodyTypeLabels: Record<string, string> = {
  sedan: "Sedán",
  suv: "SUV",
  pickup: "Pickup",
  hatchback: "Hatchback",
  coupe: "Coupé",
  van: "Van",
  other: "Otro",
};

export function transmissionLabel(value: string): string {
  return transmissionLabels[value] ?? value;
}

export function fuelLabel(value: string): string {
  return fuelLabels[value] ?? value;
}

export function bodyTypeLabel(value: string): string {
  return bodyTypeLabels[value] ?? value;
}
