import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: Props) {
  return (
    <Image
      src="/logo.svg"
      alt="Autos Harry's"
      width={2048}
      height={1583}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}
