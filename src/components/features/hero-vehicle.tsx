import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function HeroVehicle({ className }: Props) {
  return (
    <Image
      src="/hero-vehicle.png"
      alt="Toyota Hilux SR 2022 — Autos Harry's"
      width={894}
      height={636}
      priority
      sizes="(max-width: 1024px) 90vw, 600px"
      className={cn("h-auto w-full", className)}
    />
  );
}
