"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ACTION_WIDTH_PX = 96;
const SWIPE_THRESHOLD_PX = 36;
const DIRECTION_LOCK_PX = 8;

/**
 * Wraps a row with an iOS-style swipe-left-to-delete gesture.
 * Reveals `actionButton` from the right; tapping the row while it is open
 * closes it without triggering inner click handlers.
 *
 * Desktop / non-touch interaction is untouched — children stay clickable.
 */
export function SwipeableRow({
  className,
  actionButton,
  children,
}: {
  className?: string;
  actionButton: React.ReactNode;
  children: React.ReactNode;
}) {
  const [tx, setTx] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [open, setOpen] = useState(false);

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const horizontal = useRef<boolean | null>(null);
  const baseX = useRef(0);
  const movedSignificantly = useRef(false);

  function onStart(x: number, y: number) {
    startX.current = x;
    startY.current = y;
    horizontal.current = null;
    baseX.current = open ? -ACTION_WIDTH_PX : 0;
    movedSignificantly.current = false;
    setAnimating(false);
  }

  function onMove(x: number, y: number) {
    if (startX.current === null || startY.current === null) return;
    const dx = x - startX.current;
    const dy = y - startY.current;
    if (horizontal.current === null) {
      if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
      horizontal.current = Math.abs(dx) > Math.abs(dy);
    }
    if (!horizontal.current) return;
    if (Math.abs(dx) > DIRECTION_LOCK_PX) movedSignificantly.current = true;
    const target = Math.min(0, Math.max(-ACTION_WIDTH_PX - 16, baseX.current + dx));
    setTx(target);
  }

  function onEnd() {
    setAnimating(true);
    if (horizontal.current) {
      if (tx <= -SWIPE_THRESHOLD_PX) {
        setTx(-ACTION_WIDTH_PX);
        setOpen(true);
      } else {
        setTx(0);
        setOpen(false);
      }
    }
    startX.current = null;
    startY.current = null;
    horizontal.current = null;
  }

  function closeIfOpen() {
    if (open) {
      setOpen(false);
      setTx(0);
      setAnimating(true);
    }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-stretch">
        <div className={cn("pointer-events-auto flex", open ? "" : "opacity-0 transition-opacity")}
             style={{ width: ACTION_WIDTH_PX }}>
          {actionButton}
        </div>
      </div>
      <div
        style={{
          transform: `translateX(${tx}px)`,
          transition: animating ? "transform 220ms ease-out" : "none",
          touchAction: "pan-y",
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          onStart(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          onMove(t.clientX, t.clientY);
        }}
        onTouchEnd={onEnd}
        onTouchCancel={onEnd}
        onClickCapture={(e) => {
          if (movedSignificantly.current || open) {
            e.preventDefault();
            e.stopPropagation();
            closeIfOpen();
            movedSignificantly.current = false;
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
