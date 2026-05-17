import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export * from "./auth-schema";

export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "draft",
  "published",
  "reserved",
  "sold",
  "paused",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "negotiating",
  "won",
  "lost",
]);

export const transmissionEnum = pgEnum("transmission", ["manual", "automatic", "cvt"]);

export const fuelEnum = pgEnum("fuel", ["gasoline", "diesel", "hybrid", "electric"]);

export const bodyTypeEnum = pgEnum("body_type", [
  "sedan",
  "suv",
  "pickup",
  "hatchback",
  "coupe",
  "van",
  "other",
]);

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  brand: varchar("brand", { length: 60 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  priceUsd: integer("price_usd").notNull(),
  mileageKm: integer("mileage_km").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  fuel: fuelEnum("fuel").notNull(),
  bodyType: bodyTypeEnum("body_type").notNull(),
  color: varchar("color", { length: 40 }),
  description: text("description"),
  status: vehicleStatusEnum("status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const vehicleImages = pgTable("vehicle_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 200 }),
  position: integer("position").notNull().default(0),
  isCover: boolean("is_cover").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 200 }),
  message: text("message"),
  status: leadStatusEnum("status").notNull().default("new"),
  source: varchar("source", { length: 40 }).notNull().default("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const leadNotes = pgTable("lead_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  images: many(vehicleImages),
  leads: many(leads),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, { fields: [vehicleImages.vehicleId], references: [vehicles.id] }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  vehicle: one(vehicles, { fields: [leads.vehicleId], references: [vehicles.id] }),
  notes: many(leadNotes),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, { fields: [leadNotes.leadId], references: [leads.id] }),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type VehicleImage = typeof vehicleImages.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
