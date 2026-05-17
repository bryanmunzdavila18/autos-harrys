import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leadNotes, leads, user, vehicleImages, vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";

type SeedVehicle = {
  brand: string;
  model: string;
  year: number;
  priceUsd: number;
  mileageKm: number;
  transmission: "manual" | "automatic" | "cvt";
  fuel: "gasoline" | "diesel" | "hybrid" | "electric";
  bodyType: "sedan" | "suv" | "pickup" | "hatchback" | "coupe" | "van" | "other";
  color: string;
  description: string;
  featured?: boolean;
};

const seedVehicles: SeedVehicle[] = [
  {
    brand: "Toyota",
    model: "Hilux SRX",
    year: 2022,
    priceUsd: 34500,
    mileageKm: 38000,
    transmission: "manual",
    fuel: "diesel",
    bodyType: "pickup",
    color: "Blanco perla",
    description:
      "Hilux 2.8 turbo diésel 4x4, doble cabina, asientos de cuero, cámara de retroceso, control de crucero. Mantenimientos al día en concesionario.",
    featured: true,
  },
  {
    brand: "Toyota",
    model: "Land Cruiser Prado",
    year: 2021,
    priceUsd: 48000,
    mileageKm: 52000,
    transmission: "automatic",
    fuel: "gasoline",
    bodyType: "suv",
    color: "Gris plata",
    description:
      "Prado TX-L 4.0 V6, 7 asientos, tracción 4x4 permanente, asientos de cuero ventilados, techo solar.",
    featured: true,
  },
  {
    brand: "Nissan",
    model: "Frontier Pro-4X",
    year: 2023,
    priceUsd: 32500,
    mileageKm: 22000,
    transmission: "automatic",
    fuel: "gasoline",
    bodyType: "pickup",
    color: "Rojo",
    description:
      "Frontier Pro-4X 3.8 V6, doble cabina, 4x4 con bloqueo de diferencial trasero, suspensión Bilstein, único dueño.",
    featured: true,
  },
  {
    brand: "Toyota",
    model: "RAV4 XLE",
    year: 2020,
    priceUsd: 24800,
    mileageKm: 61000,
    transmission: "automatic",
    fuel: "gasoline",
    bodyType: "suv",
    color: "Azul medianoche",
    description:
      "RAV4 XLE AWD, asientos calefactados, Apple CarPlay y Android Auto, sensores de estacionamiento.",
  },
  {
    brand: "Hyundai",
    model: "Tucson",
    year: 2022,
    priceUsd: 22500,
    mileageKm: 28000,
    transmission: "automatic",
    fuel: "gasoline",
    bodyType: "suv",
    color: "Negro",
    description:
      'Tucson 2.0, pantalla táctil de 10", cámara 360°, llantas de aleación. Garantía de fábrica vigente.',
    featured: true,
  },
  {
    brand: "Hyundai",
    model: "Accent",
    year: 2021,
    priceUsd: 13800,
    mileageKm: 45000,
    transmission: "manual",
    fuel: "gasoline",
    bodyType: "sedan",
    color: "Blanco",
    description: "Accent GL 1.6, aire acondicionado, vidrios eléctricos, rendimiento excelente.",
  },
  {
    brand: "Kia",
    model: "Sportage LX",
    year: 2020,
    priceUsd: 19500,
    mileageKm: 58000,
    transmission: "automatic",
    fuel: "gasoline",
    bodyType: "suv",
    color: "Gris grafito",
    description: "Sportage LX 2.0, cámara de retroceso, Bluetooth, llantas de aleación.",
  },
  {
    brand: "Toyota",
    model: "Corolla XLI",
    year: 2019,
    priceUsd: 13500,
    mileageKm: 78000,
    transmission: "manual",
    fuel: "gasoline",
    bodyType: "sedan",
    color: "Plateado",
    description:
      "Corolla XLI 1.6, excelente estado mecánico, ideal primer carro. Recibimos vehículo en parte de pago.",
  },
  {
    brand: "Mitsubishi",
    model: "L200 GLS",
    year: 2022,
    priceUsd: 28900,
    mileageKm: 31000,
    transmission: "manual",
    fuel: "diesel",
    bodyType: "pickup",
    color: "Beige",
    description: "L200 GLS 2.4 diésel 4x4, doble cabina, llantas nuevas, gancho de remolque.",
  },
  {
    brand: "Mazda",
    model: "CX-5 Touring",
    year: 2021,
    priceUsd: 25500,
    mileageKm: 41000,
    transmission: "automatic",
    fuel: "gasoline",
    bodyType: "suv",
    color: "Rojo cristal",
    description:
      "CX-5 Touring AWD, asientos de cuero, BOSE premium audio, Apple CarPlay, sensores frontales y traseros.",
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function placeholderImage(label: string, variant: number): string {
  const palette = ["1f2937", "0f172a", "111827", "1e293b"];
  const bg = palette[variant % palette.length];
  const text = encodeURIComponent(label);
  return `https://placehold.co/1200x800/${bg}/ffffff/png?text=${text}`;
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@autosharrys.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin1234!";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Admin Autos Harry's";

async function clearDomainData() {
  console.log("→ Limpiando datos previos (vehicles, leads, etc.)");
  await db.delete(leadNotes);
  await db.delete(leads);
  await db.delete(vehicleImages);
  await db.delete(vehicles);
}

async function insertVehicles() {
  console.log(`→ Insertando ${seedVehicles.length} vehículos...`);
  for (const data of seedVehicles) {
    const baseSlug = slugify(`${data.brand} ${data.model} ${data.year} ${data.color}`);
    const [inserted] = await db
      .insert(vehicles)
      .values({
        slug: baseSlug,
        brand: data.brand,
        model: data.model,
        year: data.year,
        priceUsd: data.priceUsd,
        mileageKm: data.mileageKm,
        transmission: data.transmission,
        fuel: data.fuel,
        bodyType: data.bodyType,
        color: data.color,
        description: data.description,
        status: "published",
        featured: data.featured ?? false,
      })
      .returning({ id: vehicles.id });

    if (!inserted) {
      throw new Error(`No se pudo insertar ${baseSlug}`);
    }

    const label = `${data.brand} ${data.model} ${data.year}`;
    const images = [
      placeholderImage(label, 0),
      placeholderImage(`${label} interior`, 1),
      placeholderImage(`${label} lateral`, 2),
    ];

    await db.insert(vehicleImages).values(
      images.map((url, i) => ({
        vehicleId: inserted.id,
        url,
        alt: `${label} - foto ${i + 1}`,
        position: i,
        isCover: i === 0,
      })),
    );
  }
}

async function ensureAdminUser() {
  const existing = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL)).limit(1);

  if (existing.length > 0) {
    console.log(`→ Admin ya existe: ${ADMIN_EMAIL}`);
    return;
  }

  console.log(`→ Creando admin: ${ADMIN_EMAIL}`);
  await auth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    },
  });
}

async function main() {
  console.log("Seeding Autos Harry's");
  await clearDomainData();
  await insertVehicles();
  await ensureAdminUser();
  console.log("\nListo. Credenciales admin:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
  console.log("\nTip: cambia la contraseña desde el admin antes de producción.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
