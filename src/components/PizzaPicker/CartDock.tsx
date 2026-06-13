import { memo } from "react";

interface CartDockProps {
  count: number;
  onAdd: () => void;
}

/** Bottom arc with the add-to-cart FAB — the "counter edge" of the screen.
 *  Positions mirror the Figma frame: arc top ≈ 693, FAB ≈ 723, label ≈ 799. */
export const CartDock = memo(function CartDock({ count, onAdd }: CartDockProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[694px]">
      {/* The arc: a large white circle whose top edge curves into view */}
      <div
        className="absolute left-1/2 top-[-1px] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-white"
        style={{ boxShadow: "0 -14px 36px -18px rgba(43,26,16,.25)" }}
      />
      {/* Cart FAB */}
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add to order. ${count} item${count === 1 ? "" : "s"} in cart`}
        className="cart-fab pointer-events-auto absolute left-1/2 top-[29px] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-ember to-marinara text-white shadow-fab transition-transform active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 8h14l-1.3 11.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8z" />
          <path d="M8.5 8a3.5 3.5 0 1 1 7 0" />
        </svg>
        {count > 0 && (
          <span className="cart-badge absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-cocoa px-1.5 text-xs font-bold text-white ring-2 ring-white">
            {count}
          </span>
        )}
      </button>
      {/* Caption */}
      <span className="absolute inset-x-0 top-[105px] text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-crumb">
        Add to order
      </span>
    </div>
  );
});
