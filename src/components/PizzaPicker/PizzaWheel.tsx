import { memo } from "react";
import { WHEEL } from "@/lib/motion";
import type { Pizza } from "@/types/pizza";

interface PizzaWheelProps {
  pizzas: readonly Pizza[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * Lays out the pizzas of the filmstrip. Every pizza is anchored at the centre
 * slot; GSAP (see usePizzaWheel) owns all positioning/scaling transforms that
 * place it in the left, centre, or right slot — or slide it off-frame.
 */
export const PizzaWheel = memo(function PizzaWheel({ pizzas, activeIndex, onSelect }: PizzaWheelProps) {
  return (
    <div className="absolute inset-0" role="listbox" aria-label="Choose a pizza" aria-orientation="horizontal">
      {pizzas.map((pizza, i) => {
        const offset = i - activeIndex;
        const isActive = offset === 0;
        const isSide = Math.abs(offset) === 1; // left / right — the only tappable slots
        const isOffscreen = Math.abs(offset) > 1; // slid out of view
        return (
          <button
            key={pizza.id}
            type="button"
            role="option"
            aria-selected={isActive}
            aria-hidden={isOffscreen}
            tabIndex={isSide ? 0 : -1}
            aria-label={isActive ? `${pizza.name}, selected` : `Select ${pizza.name}`}
            onClick={() => onSelect(i)}
            className={`wheel-pizza absolute left-1/2 top-[153px] touch-none rounded-full ${
              isSide ? "cursor-pointer" : "pointer-events-none"
            }`}
            style={{
              width: WHEEL.PIZZA_SIZE,
              height: WHEEL.PIZZA_SIZE,
              marginLeft: -WHEEL.PIZZA_SIZE / 2,
              marginTop: -WHEEL.PIZZA_SIZE / 2,
              willChange: "transform, opacity",
            }}
          >
            <img
              src={pizza.image}
              alt=""
              draggable={false}
              className="pizza-img h-full w-full select-none rounded-full object-cover drop-shadow-[0_18px_24px_rgba(43,26,16,0.38)]"
              style={{ willChange: "transform" }}
            />
          </button>
        );
      })}
    </div>
  );
});
