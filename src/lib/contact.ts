const rawWhatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/[^0-9]/g, "");
const displayPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "";

export const CONTACT = {
  whatsappNumber: rawWhatsapp,
  hasWhatsapp: rawWhatsapp.length > 0,
  displayPhone,
  hasPhone: displayPhone.length > 0,
  address: "Managua, Nicaragua",
  hours: "Lunes a sábado · 8:00 AM - 6:00 PM",
  email: "ventas@autosharrys.com",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },
} as const;

export function whatsappLink(message?: string): string {
  if (!CONTACT.hasWhatsapp) return "#";
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
