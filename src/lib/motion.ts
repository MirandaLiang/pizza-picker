/**
 * Motion + geometry constants for the pizza filmstrip.
 *
 * Pizzas occupy a fixed left-to-right order. Three slots are visible — a large
 * centre slot on the plate, flanked by a small left and small right slot.
 * Selecting a side pizza slides the strip by one: the chosen pizza rises to
 * centre, the centre pizza drops into that pizza's old side slot, and the
 * pizza on the opposite side slides off its own edge and out of view. Pizzas
 * never wrap to the far side, so neighbours keep a stable relationship.
 *
 *      (off-screen ◄)   left      centre      right   (► off-screen)
 *        θ ≤ −2·SLOT   −SLOT        0        +SLOT      θ ≥ +2·SLOT
 *
 * A pizza's slot is simply `index − activeIndex`; its wheel angle is that
 * offset × SLOT_DEG. Anything past ±1 slot fades out as it leaves frame.
 */
export const WHEEL = {
  /** Degrees between adjacent slots. */
  SLOT_DEG: 58,
  /** Radius of the travel arc, px (relative to a 390 px design width). */
  ARC_RADIUS: 255,
  /** Active pizza diameter, px (matches Figma 260). */
  PIZZA_SIZE: 260,
  /** Scale applied to side pizzas — 260 × 0.542 ≈ 141 px (Figma side size). */
  SIDE_SCALE: 0.542,
  /** Degrees beyond a side slot over which an exiting pizza fades to zero.
   *  Kept short so a departing pizza is invisible before the pizza settling
   *  into the side slot grows into the same space (prevents overlap). */
  EXIT_FADE_DEG: 30,
} as const;

export const TIMING = {
  /** Main wheel transition, seconds. */
  SPIN: 0.85,
  /** Outgoing label exit. */
  INFO_OUT: 0.22,
  /** Incoming label entrance. */
  INFO_IN: 0.45,
  /** Ambient idle rotation of the active pizza — one revolution, seconds. */
  IDLE_REVOLUTION: 46,
} as const;

export const EASE = {
  SPIN: "power3.inOut",
  SETTLE: "back.out(1.6)",
  EXIT: "power2.in",
} as const;
