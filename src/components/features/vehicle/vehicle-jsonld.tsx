import { bodyTypeLabel, fuelLabel, transmissionLabel } from "@/lib/format";
import type { VehicleDetail } from "@/server/queries/vehicles";

const fuelToSchema: Record<string, string> = {
  gasoline: "Gasoline",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
};

const transmissionToSchema: Record<string, string> = {
  manual: "Manual",
  automatic: "Automatic",
  cvt: "CVT",
};

type Props = {
  vehicle: VehicleDetail;
  url: string;
};

export function VehicleJsonLd({ vehicle, url }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "@id": url,
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    description: vehicle.description ?? undefined,
    image: vehicle.images.map((img) => img.url),
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    bodyType: bodyTypeLabel(vehicle.bodyType),
    color: vehicle.color ?? undefined,
    fuelType: fuelToSchema[vehicle.fuel] ?? fuelLabel(vehicle.fuel),
    vehicleTransmission:
      transmissionToSchema[vehicle.transmission] ?? transmissionLabel(vehicle.transmission),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileageKm,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      url,
      price: vehicle.priceUsd,
      priceCurrency: "USD",
      availability:
        vehicle.status === "sold"
          ? "https://schema.org/OutOfStock"
          : vehicle.status === "reserved"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
