"use client";
import { useRef, useState } from "react";

export default function SwipeButton({
  label, onComplete, variant = "blue",
}: { label: string; onComplete: () => void; variant?: "blue" | "dark" }) {
  const track = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const [x, setX] = useState(0);
  const [drag, setDrag] = useState(false);
  const HANDLE = 48;
  const max = () => (track.current?.offsetWidth ?? 0) - HANDLE - 8;

  const down = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX - x;
    setDrag(true);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    setX(Math.min(Math.max(e.clientX - startX.current, 0), max()));
  };
  const up = () => {
    setDrag(false);
    if (x > max() * 0.85) { setX(max()); onComplete(); }
    else setX(0);
  };

  return (
    <div
      ref={track}
      style={{ position: "relative", height: 56, width: "100%", borderRadius: 999, overflow: "hidden", userSelect: "none",
        background: variant === "blue" ? "#2563eb" : "#0b1220" }}
    >
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        paddingLeft: 40, color: "#fff", fontWeight: 600, fontSize: 14 }}>
        {label} →
      </span>
      <div
        role="button" tabIndex={0} aria-label={label}
        onKeyDown={(e) => e.key === "Enter" && onComplete()}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ position: "absolute", left: 4, top: 4, width: HANDLE, height: 48, borderRadius: 999,
          background: "#22d3ee", color: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, cursor: "grab", touchAction: "none",
          transform: `translateX(${x}px)`, transition: drag ? "none" : "transform .2s" }}
      >
        ➜
      </div>
    </div>
  );
}