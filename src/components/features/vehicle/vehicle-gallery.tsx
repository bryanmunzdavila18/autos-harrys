"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

type Props = {
  images: GalleryImage[];
  vehicleLabel: string;
};

export function VehicleGallery({ images, vehicleLabel }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-muted text-muted-foreground flex aspect-[4/3] items-center justify-center rounded-2xl text-sm">
        Sin imágenes disponibles
      </div>
    );
  }

  const active = images[activeIdx] ?? images[0]!;

  return (
    <div className="space-y-3">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          key={active.id}
          src={active.url}
          alt={active.alt ?? vehicleLabel}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`Mostrar foto ${idx + 1} de ${images.length}`}
              aria-current={idx === activeIdx}
              className={cn(
                "bg-muted relative aspect-square overflow-hidden rounded-lg ring-offset-2 transition focus-visible:ring-3 focus-visible:outline-none",
                idx === activeIdx
                  ? "ring-brand-red ring-2"
                  : "hover:ring-brand-navy/40 ring-2 ring-transparent",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${vehicleLabel} - foto ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
