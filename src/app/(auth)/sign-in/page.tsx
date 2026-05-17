import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="bg-background border-border/60 w-full max-w-md space-y-6 rounded-2xl border p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <Logo className="h-16 w-auto" priority />
        <h1 className="font-display mt-2 text-xl font-bold tracking-tight">Panel administrativo</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Inicia sesión para gestionar inventario y solicitudes.
        </p>
      </div>

      <Suspense fallback={<div className="h-72" aria-hidden />}>
        <SignInForm />
      </Suspense>

      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-xs"
      >
        <ArrowLeft className="size-3" aria-hidden />
        Volver al sitio público
      </Link>
    </div>
  );
}
