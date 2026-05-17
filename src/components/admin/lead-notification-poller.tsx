"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Payload = {
  count: number;
  latest: {
    id: string;
    name: string;
    createdAt: string;
    vehicleLabel: string | null;
  } | null;
};

const POLL_INTERVAL_MS = 20_000;

type Props = {
  initialCount: number;
};

export function LeadNotificationPoller({ initialCount }: Props) {
  const router = useRouter();
  const previousCountRef = useRef(initialCount);
  const lastSeenIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    async function tick() {
      try {
        const res = await fetch("/api/admin/leads/unread", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as Payload;
        const newCount = data.count;
        const previous = previousCountRef.current;

        if (newCount > previous && data.latest && data.latest.id !== lastSeenIdRef.current) {
          const diff = newCount - previous;
          const title =
            diff === 1 ? `Nueva solicitud de ${data.latest.name}` : `${diff} nuevas solicitudes`;
          const description = data.latest.vehicleLabel
            ? `Interesado en ${data.latest.vehicleLabel}`
            : "Click para verla en la bandeja";

          toast.info(title, {
            description,
            duration: 8000,
            action: {
              label: "Ver",
              onClick: () => router.push("/admin/leads"),
            },
          });
          lastSeenIdRef.current = data.latest.id;
          router.refresh();
        } else if (newCount !== previous) {
          router.refresh();
        }
        previousCountRef.current = newCount;
      } catch {
        // silent — poller continues
      }
    }

    interval = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [router]);

  return null;
}
