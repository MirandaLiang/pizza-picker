import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { PIZZAS } from "@/data/pizzas";
import { usePizzaWheel } from "./usePizzaWheel";
import { PizzaWheel } from "./PizzaWheel";
import { PizzaInfo } from "./PizzaInfo";
import { Particles } from "./Particles";
import { CartDock } from "./CartDock";

const SWIPE_THRESHOLD_PX = 42;

/**
 * Pizza selection experience — a fixed 390 × 844 mobile design that mirrors the
 * Figma frame "Pizza Picker · High-fidelity" 1:1 (absolute coordinates).
 *
 * Interaction model (linear filmstrip):
 *  - Pizzas hold a fixed left-to-right order; one sits large in the centre,
 *    its neighbours peek in from the left and right edges.
 *  - Tap a side pizza, swipe, or use ←/→ to slide the strip one slot. The
 *    centre pizza keeps its ambient spin throughout.
 *  - Name / rating / price cross-fade with each selection.
 *  - Cart FAB on the bottom arc; adding sends the pizza flying in.
 */
export function PizzaPicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const { activeIndex, prevIndex, select, step, flyToCart } = usePizzaWheel({
    scope: containerRef,
    count: PIZZAS.length,
  });

  const current = PIZZAS[activeIndex]!;
  const outgoing = prevIndex !== null ? (PIZZAS[prevIndex] ?? null) : null;

  const onPointerDown = useCallback((e: PointerEvent) => {
    swipeStartX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      if (swipeStartX.current === null) return;
      const dx = e.clientX - swipeStartX.current;
      swipeStartX.current = null;
      if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) step(dx < 0 ? 1 : -1);
    },
    [step],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    },
    [step],
  );

  const handleAdd = useCallback(
    () => flyToCart(() => setCartCount((n) => n + 1)),
    [flyToCart],
  );

  return (
    <main
      ref={containerRef}
      className="relative mx-auto h-dvh w-full max-w-[390px] overflow-hidden bg-flour"
      style={{ height: 844 }}
      onKeyDown={onKeyDown}
    >
      {/* Header — Menu / location */}
      <h1 className="intro-rise absolute left-6 top-11 font-display text-[26px] font-bold leading-none">Menu</h1>
      <p className="intro-rise absolute left-6 top-20 flex items-center gap-1 text-xs font-medium text-crumb">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        San Francisco
      </p>

      {/* Account button */}
      <button
        type="button"
        aria-label="Account"
        className="intro-rise absolute left-[327px] top-11 grid h-10 w-10 place-items-center rounded-full border border-cocoa/10 bg-white text-cocoa shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
        </svg>
      </button>

      {/* Category chips */}
      <nav className="intro-rise absolute left-6 top-[118px] flex gap-2" aria-label="Categories">
        <span className="rounded-full bg-gradient-to-br from-ember to-marinara px-4 py-1.5 text-[13px] font-bold text-white shadow-fab">
          Pizza
        </span>
        <span className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-crumb">Pasta</span>
        <span className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-crumb">Sides</span>
      </nav>

      {/* Hero band: particles + pizzas (swipe surface) */}
      <section
        className="absolute inset-x-0 top-[200px] h-[330px] touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-roledescription="carousel"
      >
        <Particles />
        <PizzaWheel pizzas={PIZZAS} activeIndex={activeIndex} onSelect={select} />
      </section>

      {/* Labels — name / tagline / rating / price */}
      <section className="absolute inset-x-0 top-[504px] px-6 text-center">
        <PizzaInfo current={current} outgoing={outgoing} />
      </section>

      <CartDock count={cartCount} onAdd={handleAdd} />

      {/* Flying clone used by the add-to-cart animation */}
      <img className="fly-pizza pointer-events-none invisible absolute left-0 top-0 z-50 h-[120px] w-[120px] rounded-full" alt="" aria-hidden="true" />
    </main>
  );
}
