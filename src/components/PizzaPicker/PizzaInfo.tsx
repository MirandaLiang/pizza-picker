import { memo } from "react";
import { formatPrice } from "@/data/pizzas";
import type { Pizza } from "@/types/pizza";

interface PizzaInfoProps {
  current: Pizza;
  /** Pizza leaving the plate during a transition; rendered for the cross-fade. */
  outgoing: Pizza | null;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center justify-center gap-1" aria-label={`Rated ${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-roast" : "fill-cocoa/15"}`}
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
    ))}
    <span className="ml-1 text-xs font-semibold text-crumb">{rating.toFixed(1)}</span>
  </div>
);

const InfoCard = ({ pizza, layer }: { pizza: Pizza; layer: "in" | "out" | "static" }) => (
  <div
    className={`${layer === "out" ? "info-out" : layer === "in" ? "info-in" : ""} absolute inset-x-0 top-0 flex flex-col items-center gap-1.5`}
  >
    <h2 className="font-display text-[28px] font-bold leading-tight tracking-tight">{pizza.name}</h2>
    <p className="text-[13px] font-medium text-crumb">{pizza.tagline}</p>
    <Stars rating={pizza.rating} />
    <p className="font-display text-[34px] font-bold text-roast">
      <span className="align-top text-[20px]">$</span>
      {formatPrice(pizza.priceCents).replace("$", "")}
    </p>
  </div>
);

/** Name / rating / price block with GSAP-driven cross-fade between selections. */
export const PizzaInfo = memo(function PizzaInfo({ current, outgoing }: PizzaInfoProps) {
  return (
    <div className="intro-rise relative h-[136px]" aria-live="polite">
      {outgoing && <InfoCard pizza={outgoing} layer="out" />}
      <InfoCard key={current.id} pizza={current} layer={outgoing ? "in" : "static"} />
    </div>
  );
});
