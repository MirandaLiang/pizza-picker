/** A menu item rendered on the selection wheel. */
export interface Pizza {
  /** Stable identifier used as React key and analytics id. */
  id: string;
  /** Display name, e.g. "New Orleans". */
  name: string;
  /** Short flavour line shown under the name. */
  tagline: string;
  /** Price in minor units (cents) to avoid float arithmetic. */
  priceCents: number;
  /** Average rating, 0–5. */
  rating: number;
  /** Public path of the circular cutout image (transparent background). */
  image: string;
}

/** Direction the wheel travels during a transition. */
export type SpinDirection = 1 | -1;
