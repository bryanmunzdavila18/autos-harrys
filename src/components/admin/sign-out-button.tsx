"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      router.push("/sign-in");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="text-muted-foreground hover:text-foreground inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60"
    >
      <LogOut className="size-4" aria-hidden />
      {isPending ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
