import type { Pizza } from "@/types/pizza";

export const PIZZAS: readonly Pizza[] = [
  {
    id: "margherita-verde",
    name: "Margherita Verde",
    tagline: "Fior di latte · olives · peppers",
    priceCents: 1200,
    rating: 4.6,
    image: "/pizzas/margherita.webp",
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Double pepperoni · aged cheddar",
    priceCents: 1600,
    rating: 5.0,
    image: "/pizzas/pepperoni.webp",
  },
  {
    id: "diavola-brava",
    name: "Diavola Brava",
    tagline: "Calabrian chili · oregano crust",
    priceCents: 1400,
    rating: 4.9,
    image: "/pizzas/diavola.webp",
  },
] as const;

export const formatPrice = (cents: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
