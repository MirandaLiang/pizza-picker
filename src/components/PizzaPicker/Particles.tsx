import { memo } from "react";

interface ParticleSpec {
  x: string; // left, %
  y: string; // top, %
  size: number;
  kind: "pepperoni" | "basil" | "pepper" | "crumb";
  rotate: number;
}

const SPECS: readonly ParticleSpec[] = [
  { x: "8%", y: "18%", size: 10, kind: "pepperoni", rotate: 12 },
  { x: "16%", y: "52%", size: 7, kind: "crumb", rotate: -20 },
  { x: "6%", y: "72%", size: 12, kind: "basil", rotate: 40 },
  { x: "24%", y: "8%", size: 6, kind: "pepper", rotate: 0 },
  { x: "78%", y: "10%", size: 8, kind: "crumb", rotate: 30 },
  { x: "90%", y: "34%", size: 11, kind: "basil", rotate: -25 },
  { x: "84%", y: "64%", size: 9, kind: "pepperoni", rotate: 60 },
  { x: "68%", y: "84%", size: 6, kind: "pepper", rotate: 15 },
  { x: "30%", y: "88%", size: 8, kind: "pepperoni", rotate: -45 },
  { x: "55%", y: "4%", size: 7, kind: "crumb", rotate: 0 },
];

const FILL: Record<ParticleSpec["kind"], string> = {
  pepperoni: "#C8401F",
  basil: "#3E7C3A",
  pepper: "#2B1A10",
  crumb: "#E2A75F",
};

const Shape = ({ spec }: { spec: ParticleSpec }) =>
  spec.kind === "basil" ? (
    <svg viewBox="0 0 12 12" width={spec.size} height={spec.size} aria-hidden="true">
      <path d="M6 0C9.5 1.5 11 5 10.5 9 7 10.5 3 9.5 1.5 6 2.5 2.5 4 1 6 0z" fill={FILL.basil} />
      <path d="M2.5 8.5C4.5 6.5 7 4.5 9.5 3.5" stroke="#2C5A29" strokeWidth=".7" fill="none" />
    </svg>
  ) : (
    <span
      className="block rounded-full"
      style={{
        width: spec.size,
        height: spec.kind === "pepper" ? spec.size / 2.2 : spec.size,
        background: FILL[spec.kind],
        borderRadius: spec.kind === "pepper" ? 4 : "50%",
      }}
    />
  );

/** Loose ingredients scattered around the hero; GSAP tosses `.particle` on each spin. */
export const Particles = memo(function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {SPECS.map((spec, i) => (
        <span
          key={i}
          className="particle absolute opacity-70"
          style={{ left: spec.x, top: spec.y, transform: `rotate(${spec.rotate}deg)` }}
        >
          <Shape spec={spec} />
        </span>
      ))}
    </div>
  );
});
