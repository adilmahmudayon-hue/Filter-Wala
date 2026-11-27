"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useLang } from "@/components/Lang";
import { floorLabel } from "@/lib/data";

export function BigTile({
  href, onClick, emoji, title, sub, badge, dark,
}: {
  href?: string; onClick?: () => void; emoji: string; title: string; sub?: string;
  badge?: string | number; dark?: boolean;
}) {
  const inner = (
    <>
      <span className="em">{emoji}</span>
      <span style={{ flex: 1 }}>
        <span className="tt block">{title}</span>
        {sub && <span className="muted block text-sm">{sub}</span>}
      </span>
      {badge !== undefined && badge !== "" && <span className="chip chip-aqua">{badge}</span>}
    </>
  );
  const cls = `tile ${dark ? "tile-dark" : ""}`;
  return href ? (
    <Link href={href} className={cls}>{inner}</Link>
  ) : (
    <button onClick={onClick} className={cls}>{inner}</button>
  );
}

export function Back({ href }: { href: string }) {
  const { t } = useLang();
  return (
    <Link href={href} className="text-sm font-medium" style={{ color: "#1d4ed8" }}>
      {t("← Back", "← ফিরে যান")}
    </Link>
  );
}

export function CountTabs<T extends string>({
  tabs, value, onChange,
}: { tabs: { key: T; label: string; count: number }[]; value: T; onChange: (k: T) => void }) {
  return (
    <div className="flex gap-2">
      {tabs.map((x) => (
        <button key={x.key} onClick={() => onChange(x.key)} className={`tabbtn ${value === x.key ? "on" : ""}`}>
          <span className="n">{x.count}</span>
          {x.label}
        </button>
      ))}
    </div>
  );
}

export function Field({
  label, value, onChange, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block text-sm font-medium">{label}
      <input className="input mt-1" type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function FloorSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { bn } = useLang();
  return (
    <select className="input" value={value} onChange={(e) => onChange(+e.target.value)}>
      {Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{floorLabel(i, bn)}</option>)}
    </select>
  );
}

export function Shot({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img src={src} alt="payment" onClick={() => setOpen(true)}
        style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1.5px solid #7dd3fc", cursor: "zoom-in" }} />
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(11,18,32,.85)", zIndex: 50, display: "flex",
            alignItems: "center", justifyContent: "center", padding: 16, cursor: "zoom-out" }}>
          <img src={src} alt="payment full" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12 }} />
        </div>
      )}
    </>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}