import { useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EASE, TIMING, WHEEL } from "@/lib/motion";
import type { SpinDirection } from "@/types/pizza";

gsap.registerPlugin(useGSAP);

interface UsePizzaWheelOptions {
  /** Scope element containing `.wheel-pizza`, `.pizza-img`, `.particle`, `.info-*`, `.cart-fab` nodes. */
  scope: RefObject<HTMLDivElement | null>;
  /** Number of pizzas on the wheel. */
  count: number;
}

interface PizzaWheelApi {
  activeIndex: number;
  /** Index leaving the plate during a transition, otherwise null. */
  prevIndex: number | null;
  /** Rotate the wheel so `index` lands on the plate. No-op while spinning. */
  select: (index: number) => void;
  /** Step the wheel one slot in `direction` (+1 = next / clockwise). */
  step: (direction: SpinDirection) => void;
  /** Animate the active pizza flying into the cart FAB, then invoke the callback. */
  flyToCart: (onLanded: () => void) => void;
}

/** Signed slot of pizza `i` relative to the centred pizza: …−2,−1, 0, +1, +2…
 *  Linear (no wrap): pizzas keep a fixed order and slide off the ends. */
const slotOffset = (i: number, active: number): number => i - active;

/** Project a wheel angle (deg, 0 = plate) into transform values.
 *  Beyond ±1 slot the pizza is off-frame and fades out. */
const project = (theta: number) => {
  const rad = (theta * Math.PI) / 180;
  const progress = Math.min(Math.abs(theta) / WHEEL.SLOT_DEG, 1);
  const beyond = Math.max(Math.abs(theta) - WHEEL.SLOT_DEG, 0);
  return {
    x: Math.sin(rad) * WHEEL.ARC_RADIUS,
    y: (1 - Math.cos(rad)) * WHEEL.ARC_RADIUS,
    scale: 1 - (1 - WHEEL.SIDE_SCALE) * progress,
    opacity: gsap.utils.clamp(0, 1, 1 - beyond / WHEEL.EXIT_FADE_DEG),
    zIndex: 100 - Math.round(Math.abs(theta)),
  };
};

/**
 * Drives the pizza-selection wheel.
 *
 * All animation lives in a single GSAP context scoped to `scope`
 * (auto-reverted on unmount). Transitions are built inside `useGSAP`
 * with `dependencies: [activeIndex]` so the timeline runs after React
 * has committed the new labels — the GSAP-recommended React pattern.
 */
export function usePizzaWheel({ scope, count }: UsePizzaWheelOptions): PizzaWheelApi {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(count / 2));
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const spinningRef = useRef(false);
  const initializedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const thetasRef = useRef<Array<{ theta: number }>>([]);

  const { contextSafe } = useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const pizzas = gsap.utils.toArray<HTMLElement>(".wheel-pizza", root);

      const apply = (el: HTMLElement, theta: number) => gsap.set(el, project(theta));

      /* ----- mount: place pizzas, start ambient idle spin ----- */
      if (!initializedRef.current) {
        initializedRef.current = true;
        reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        thetasRef.current = pizzas.map((_, i) => ({
          theta: slotOffset(i, activeIndex) * WHEEL.SLOT_DEG,
        }));
        pizzas.forEach((el, i) => apply(el, thetasRef.current[i]!.theta));

        if (!reduceMotionRef.current) {
          gsap.to(".pizza-img", {
            rotation: "+=360",
            duration: TIMING.IDLE_REVOLUTION,
            repeat: -1,
            ease: "none",
          });
        }

        gsap.from(root.querySelectorAll(".intro-rise"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        });
        return;
      }

      /* ----- transition: runs after activeIndex commit ----- */
      if (prevIndex === null) return;

      const tl = gsap.timeline({
        defaults: { duration: TIMING.SPIN, ease: EASE.SPIN },
        onComplete: () => {
          spinningRef.current = false;
          setPrevIndex(null);
        },
      });
      if (reduceMotionRef.current) tl.timeScale(50);

      pizzas.forEach((el, i) => {
        const proxy = thetasRef.current[i]!;
        const targetOffset = slotOffset(i, activeIndex);
        const target = targetOffset * WHEEL.SLOT_DEG;

        // Every pizza slides directly to its new slot with the SAME easing.
        // Because each travels an identical 58° per step, a shared curve keeps
        // their angular spacing constant throughout — so the centre pizza and
        // a side pizza can never converge and overlap mid-transition. (A
        // per-pizza "settle" ease was what caused the incoming pizza to race
        // ahead of the outgoing one.) Pizzas leaving the ±1 window keep
        // travelling the same arc and fade off-frame; own-axis spin is left to
        // the continuous idle tween.
        const onUpdate = () => gsap.set(el, project(proxy.theta));
        tl.to(proxy, { theta: target, ease: EASE.SPIN, onUpdate }, 0);
      });

      tl.addLabel("landing", TIMING.SPIN * 0.45)
        // Loose ingredients get tossed by the motion.
        .to(
          ".particle",
          {
            y: "random(-12, 12)",
            rotation: "random(-40, 40)",
            duration: 0.45,
            stagger: 0.02,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          0,
        )
        // Labels: outgoing drops away, incoming rises with the settle.
        .to(".info-out", { y: 18, autoAlpha: 0, duration: TIMING.INFO_OUT, ease: EASE.EXIT }, 0)
        .fromTo(
          ".info-in",
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: TIMING.INFO_IN, ease: EASE.SETTLE },
          0.3,
        );
    },
    { scope, dependencies: [activeIndex] },
  );

  const select = contextSafe((index: number) => {
    if (spinningRef.current || index === activeIndex || index < 0 || index >= count) return;
    spinningRef.current = true;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  });

  // Swipe / arrow keys advance one slot, clamped at the ends (no wrap).
  const step = (direction: SpinDirection) =>
    select(gsap.utils.clamp(0, count - 1, activeIndex + direction));

  const flyToCart = contextSafe((onLanded: () => void) => {
    const root = scope.current;
    if (!root) return;
    const fly = root.querySelector<HTMLImageElement>(".fly-pizza");
    const fab = root.querySelector<HTMLElement>(".cart-fab");
    const activeImg = root.querySelectorAll<HTMLImageElement>(".pizza-img")[activeIndex];
    if (!fly || !fab || !activeImg) return;

    fly.src = activeImg.src;
    const rootBox = root.getBoundingClientRect();
    const from = activeImg.getBoundingClientRect();
    const to = fab.getBoundingClientRect();
    const cx = (r: DOMRect) => r.left + r.width / 2 - rootBox.left;
    const cy = (r: DOMRect) => r.top + r.height / 2 - rootBox.top;

    const tl = gsap.timeline();
    if (reduceMotionRef.current) tl.timeScale(50);
    tl.set(fly, { x: cx(from), y: cy(from), xPercent: -50, yPercent: -50, scale: 0.82, autoAlpha: 1 })
      .to(fly, { x: cx(to), y: cy(to), scale: 0.1, rotation: 120, duration: 0.6, ease: "power2.in" })
      .to(fly, { autoAlpha: 0, duration: 0.12 }, "-=0.08")
      .add(() => onLanded(), "-=0.1")
      .fromTo(fab, { scale: 1 }, { scale: 1.18, duration: 0.14, yoyo: true, repeat: 1, ease: "power1.inOut" }, "-=0.12");
  });

  return { activeIndex, prevIndex, select, step, flyToCart };
}
