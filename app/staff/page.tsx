"use client";
import { useState } from "react";
import Link from "next/link";
import { Order, floorLabel } from "@/lib/data";
import { useStore } from "@/components/Store";
import Guard from "@/components/Guard";
import SwipeButton from "@/components/SwipeButton";

function Card({ o }: { o: Order }) {
  const { sendEta, complete } = useStore();
  const [custom, setCustom] = useState("");
  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{o.customer}</div>
          <a href={`tel:${o.phone}`} className="text-sm font-medium" style={{ color: "#1d4ed8" }}>📞 {o.phone}</a>
        </div>
        <div className="rounded-lg px-3 py-1 text-center" style={{ background: "#0b1220", color: "#fff" }}>
          <div className="text-[10px] uppercase" style={{ color: "#22d3ee" }}>Floor</div>
          <div className="text-lg font-bold">{floorLabel(o.floor)}</div>
        </div>
      </div>

      <div className="muted text-sm">📍 {o.building}</div>
      <div className="text-sm">{o.qty} × {o.item} · <b>৳{o.total}</b></div>

      <div className="flex flex-wrap gap-2">
        <span className={`chip ${o.pay === "COD" ? "chip-dark" : "chip-blue"}`}>
          {o.pay === "COD" ? "Cash Due" : `${o.pay} · ${o.trxId}`}
        </span>
        <span className="chip chip-gray">🕒 {o.slot}</span>
        {o.status === "Received" && <span className="chip chip-aqua">✔ Received by Student</span>}
        {o.eta && <span className="chip chip-aqua">ETA {o.eta}</span>}
      </div>

      {o.status !== "Received" && (
        <div className="flex flex-wrap gap-2">
          {["in 20 mins", "in 45 mins"].map((t) => (
            <button key={t} onClick={() => sendEta(o.id, t)} className="btn-outline" style={{ padding: "8px 12px", fontSize: 14 }}>
              Send ETA: {t}
            </button>
          ))}
          <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom e.g. 5:30 PM"
            className="input min-w-0 flex-1" />
          <button disabled={!custom.trim()} onClick={() => { sendEta(o.id, custom.trim()); setCustom(""); }}
            className="btn" style={{ padding: "8px 14px", fontSize: 14 }}>Send</button>
        </div>
      )}

      <SwipeButton variant="dark" label="Swipe right to complete" onComplete={() => complete(o.id)} />
    </div>
  );
}

function Inner() {
  const { user, orders, companies } = useStore();
  const company = companies.find((c) => c.id === user!.companyId);
  const mine = orders.filter((o) => o.companyId === user!.companyId);
  const active = mine.filter((o) => o.status !== "Completed");
  const done = mine.filter((o) => o.status === "Completed");

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{company?.name} — Orders</h1>
          <p className="muted text-sm">{active.length} active · {done.length} completed</p>
        </div>
        <Link href="/staff/prices" className="btn-outline" style={{ padding: "8px 14px", fontSize: 14 }}>Edit prices</Link>
      </div>
      {active.length === 0 && <p className="muted">No active orders 🎉</p>}
      {active.map((o) => <Card key={o.id} o={o} />)}

      {done.length > 0 && (
        <>
          <h2 className="pt-4 font-semibold">Completed history</h2>
          {done.map((o) => (
            <div key={o.id} className="card text-sm">
              {o.id} · {o.customer} · {o.qty} × {o.item} · ৳{o.total} ✅
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function StaffPage() {
  return <Guard role="staff"><Inner /></Guard>;
}