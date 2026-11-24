"use client";
import { useState } from "react";
import Link from "next/link";
import { ITEMS, SLOTS, ItemKey, PayMethod, floorFee, floorLabel } from "@/lib/data";
import { useStore } from "@/components/Store";
import Guard from "@/components/Guard";
import SwipeButton from "@/components/SwipeButton";

const badge: Record<string, string> = {
  Pending: "chip-gray", Scheduled: "chip-aqua", Received: "chip-blue", Completed: "chip-dark",
};

function Inner() {
  const { user, companies, orders, addOrder, markReceived } = useStore();
  const u = user!;
  const floor = u.floor ?? 0;
  const active = companies.filter((c) => c.active);
  const [companyId, setCompanyId] = useState(active[0]?.id ?? "");
  const [itemKey, setItemKey] = useState<ItemKey>("refill");
  const [qty, setQty] = useState(1);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [pay, setPay] = useState<PayMethod>("COD");
  const [trx, setTrx] = useState("");
  const [sender, setSender] = useState("");
  const [msg, setMsg] = useState("");

  const company = companies.find((c) => c.id === companyId);
  if (!company) return <p className="muted">No active vendors available right now.</p>;

  const fee = floorFee(company.bands, floor);
  const total = (company.prices[itemKey] + fee) * qty;
  const number = pay === "bKash" ? company.bkash : company.nagad;
  const mine = orders.filter((o) => o.customerId === u.id);

  const submit = () => {
    if (pay !== "COD" && (!trx.trim() || !sender.trim())) {
      setMsg("Please enter the TrxID and sender number.");
      return;
    }
    addOrder({
      companyId, customerId: u.id, customer: u.name, phone: u.phone,
      building: `${u.building}, ${u.area}`, floor,
      item: ITEMS.find((i) => i.key === itemKey)!.label, qty, total, slot, pay,
      trxId: pay === "COD" ? undefined : trx.trim(),
    });
    setTrx(""); setSender(""); setQty(1); setMsg("Order placed! Track it below.");
  };

  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <h2 className="text-lg font-bold">Place an order</h2>
        <div className="panel text-sm">
          <b>{u.name}</b> · {u.building}, {u.area} · <b>{floorLabel(floor)}</b>
          <div>
            <Link href="/profile" style={{ color: "#1d4ed8", fontWeight: 600 }}>Change address / floor</Link>
          </div>
        </div>

        <label className="block text-sm font-medium">Vendor
          <select className="input mt-1" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            {active.map((c) => <option key={c.id} value={c.id}>{c.name} — refill ৳{c.prices.refill}</option>)}
          </select>
        </label>

        <label className="block text-sm font-medium">Item
          <select className="input mt-1" value={itemKey} onChange={(e) => setItemKey(e.target.value as ItemKey)}>
            {ITEMS.map((i) => <option key={i.key} value={i.key}>{i.label} — ৳{company.prices[i.key]}</option>)}
          </select>
        </label>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Quantity</span>
          <button className="btn-round" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button className="btn-round" onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <label className="block text-sm font-medium">Preferred time
          <select className="input mt-1" value={slot} onChange={(e) => setSlot(e.target.value)}>
            {SLOTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>

        <div>
          <div className="mb-1 text-sm font-medium">Payment</div>
          <div className="grid grid-cols-3 gap-2">
            {(["COD", "bKash", "Nagad"] as PayMethod[]).map((p) => (
              <button key={p} onClick={() => setPay(p)} className={`btn-outline ${pay === p ? "on" : ""}`}>
                {p === "COD" ? "Cash" : p}
              </button>
            ))}
          </div>
        </div>

        {pay !== "COD" && (
          <div className="panel space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span>Send ৳{total} to {pay}: <b>{number || "not set"}</b></span>
              <button className="btn-outline" style={{ padding: "4px 10px", fontSize: 12 }}
                onClick={() => navigator.clipboard?.writeText(number)}>Copy</button>
            </div>
            <input className="input" placeholder="Transaction ID (TrxID)" value={trx} onChange={(e) => setTrx(e.target.value)} />
            <input className="input" placeholder="Sender phone number" value={sender} onChange={(e) => setSender(e.target.value)} />
          </div>
        )}

        <div className="panel text-sm">
          (৳{company.prices[itemKey]} + ৳{fee} floor charge) × {qty}
          <div className="text-xl font-bold" style={{ color: "#1d4ed8" }}>Total ৳{total}</div>
        </div>

        {msg && <p className="text-sm font-medium" style={{ color: "#155e75" }}>{msg}</p>}
        <button onClick={submit} className="btn w-full" style={{ padding: "14px" }}>Place Order</button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">My orders</h2>
        {mine.length === 0 && <p className="muted text-sm">No orders yet.</p>}
        {mine.map((o) => (
          <div key={o.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <b>{o.id}</b>
              <span className={`chip ${badge[o.status]}`}>{o.status}</span>
            </div>
            <div className="text-sm">
              {o.qty} × {o.item} · ৳{o.total} · {o.pay === "COD" ? "Cash Due" : `${o.pay} ${o.trxId}`}
            </div>
            <div className="muted text-sm">Slot: {o.slot}</div>
            {o.eta && <div className="panel text-sm font-medium">🕒 Arriving {o.eta}</div>}
            {(o.status === "Pending" || o.status === "Scheduled") && (
              <SwipeButton label="Swipe to confirm received" onComplete={() => markReceived(o.id)} />
            )}
            {o.status === "Received" && <p className="muted text-xs">Waiting for the vendor to confirm payment and close the order.</p>}
          </div>
        ))}
      </section>
    </div>
  );
}

export default function StudentPage() {
  return <Guard role="student"><Inner /></Guard>;
}