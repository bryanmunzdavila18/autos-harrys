# Autos Harrys

> Plataforma web para autolote en Managua, Nicaragua: catálogo público SEO-friendly + back-office para gestión de inventario y solicitudes de compra.

Construida como proyecto de portafolio mientras se entrega como producto real al cliente final. El foco está en arquitectura limpia, performance, accesibilidad y experiencia de developer end-to-end.

---

## Tech stack

| Capa           | Herramienta                                                                       | Por qué                                                         |
| -------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org) (App Router)                                     | Server Components, streaming, SSR para SEO crítico del catálogo |
| Lenguaje       | TypeScript en modo strict-plus                                                    | `noUncheckedIndexedAccess`, `noImplicitOverride` activos        |
| UI             | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)   | Productividad sin lock-in; los componentes viven en el repo     |
| Base de datos  | [PostgreSQL en Neon](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) | Serverless, branching para previews, ORM 100% tipado            |
| Auth           | [Better Auth](https://www.better-auth.com)                                        | Self-hosted, sin lock-in, tipado de extremo a extremo           |
| Forms + Zod    | React Hook Form + [Zod](https://zod.dev)                                          | Validación compartida entre cliente y Server Actions            |
| Notificaciones | Telegram Bot API + [Resend](https://resend.com)                                   | Dueño recibe leads al teléfono al instante; email como respaldo |
| Imágenes       | Cloudflare R2 + `next/image`                                                      | Storage barato, optimización automática (AVIF/WebP, responsive) |
| Testing        | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev)               | Unit + E2E desde día uno                                        |
| Calidad        | ESLint flat config + jsx-a11y + Prettier + Husky + commitlint + lint-staged       | Hooks pre-commit; CI bloquea PRs que rompen el estándar         |
| Hosting        | [Vercel](https://vercel.com)                                                      | Edge runtime, preview deploys por PR                            |

## Arquitectura

```
src/
├── app/
│   ├── (public)/        Layout y rutas del sitio público (catálogo, detalle, contacto)
│   ├── (admin)/         Layout y rutas del back-office (protegidas con Better Auth)
│   ├── api/             Webhooks y endpoints específicos
│   └── layout.tsx       Root layout: fuentes, ThemeProvider, Toaster
├── components/
│   ├── ui/              Componentes de shadcn/ui
│   └── features/        Componentes por dominio (vehicle, lead, etc.)
├── db/
│   ├── index.ts         Cliente Drizzle + Neon
│   └── schema.ts        Tablas: vehicles, vehicle_images, leads, lead_notes
├── lib/
│   ├── env.ts           Validación de variables de entorno con Zod
│   ├── auth.ts          Better Auth configurado con Drizzle adapter
│   ├── telegram.ts      Envío de notificaciones al dueño
│   └── utils.ts         Helpers compartidos (cn)
└── server/
    └── actions/         Server Actions tipadas agrupadas por dominio
```

## Decisiones técnicas

- **Server Components por defecto.** Solo se marca `"use client"` lo que necesita interactividad (forms, kanban drag-and-drop). El catálogo y detalle son server-rendered para SEO y performance.
- **Server Actions sobre API routes.** Inputs validados con Zod, output tipado. Una sola fuente de verdad entre cliente y servidor.
- **`snake_case` en Postgres, `camelCase` en TypeScript.** Configurado en Drizzle (`casing: "snake_case"`).
- **`server-only` en módulos sensibles.** Evita filtrar credenciales o cliente DB al bundle del navegador.
- **Validación de env en tiempo de build.** `@t3-oss/env-nextjs` rompe el build si falta una variable requerida.
- **Notificación al dueño vía Telegram.** Más simple que WhatsApp Business API (costo + aprobación), llega instantánea al celular.

## Objetivos de calidad

| Métrica                  | Target           |
| ------------------------ | ---------------- |
| Lighthouse mobile        | ≥ 95             |
| LCP (catálogo + detalle) | < 2.0s en 4G     |
| CLS                      | < 0.05           |
| TypeScript strict        | sin `any`        |
| Test coverage (lógica)   | crítica cubierta |
| Accesibilidad (axe)      | 0 errores        |

## Setup local

```bash
# Pre-requisitos: Node 22+, pnpm 11+
pnpm install

# Variables de entorno
cp .env.example .env.local
# editar .env.local con DATABASE_URL, BETTER_AUTH_SECRET, etc.
# generar el secret con: openssl rand -base64 32

# Migraciones
pnpm db:push     # sincroniza schema con la DB (dev)
# o
pnpm db:generate && pnpm db:migrate

# Dev server
pnpm dev
```

### Scripts

| Script             | Descripción                           |
| ------------------ | ------------------------------------- |
| `pnpm dev`         | Dev server (Turbopack)                |
| `pnpm build`       | Build de producción                   |
| `pnpm start`       | Servir el build                       |
| `pnpm lint`        | ESLint                                |
| `pnpm typecheck`   | `tsc --noEmit`                        |
| `pnpm format`      | Prettier write                        |
| `pnpm test`        | Vitest watch                          |
| `pnpm test:run`    | Vitest una sola corrida               |
| `pnpm test:e2e`    | Playwright                            |
| `pnpm db:studio`   | UI para inspeccionar la base de datos |
| `pnpm db:push`     | Sincroniza schema con DB (dev)        |
| `pnpm db:generate` | Genera migraciones SQL                |
| `pnpm db:migrate`  | Aplica migraciones                    |

## Roadmap

### Fase 1 — MVP

- [x] Scaffold (Next.js + Tailwind + shadcn + Drizzle + Better Auth + CI)
- [ ] Catálogo público con filtros (marca, modelo, año, precio, kilometraje)
- [ ] Detalle de vehículo con galería
- [ ] Formulario de solicitud + notificación al dueño (Telegram + email)
- [ ] Admin: login, CRUD de vehículos, listado de leads
- [ ] SEO completo (metadata dinámica, sitemap, schema.org `Vehicle`/`Offer`)

### Fase 2 — Pulir

- [ ] Pipeline kanban de leads con `useOptimistic`
- [ ] Calculadora de financiamiento
- [ ] Dashboard con métricas
- [ ] Importar inventario desde CSV

### Fase 3 — Crecimiento

- [ ] Comparador de vehículos
- [ ] Favoritos sin login (cookies)
- [ ] Reportes para el dueño

## Licencia

MIT
