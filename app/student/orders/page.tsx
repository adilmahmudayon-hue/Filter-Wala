"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import SwipeButton from "@/components/SwipeButton";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back } from "@/components/UI";
import { Order, SLOTS, SlotKey, etaText, itemLabel, payLabel, slotLabel, statusLabel } from "@/lib/data";

const badge: Record<string, string> = {
  Pending: "chip-gray", Scheduled: "chip-aqua", Received: "chip-blue", Completed: "chip-dark",
};

function PendingCard({ o }: { o: Order }) {
  const { companies, markReceived, reschedule } = useStore();
  const { t, bn } = useLang();
  const [editing, setEditing] = useState(false);
  const [slot, setSlot] = useState<SlotKey>(o.slot);
  const vendor = companies.find((c) => c.id === o.companyId)?.name;

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <b>{o.id} · {vendor}</b>
        <span className={`chip ${badge[o.status]}`}>{statusLabel(o.status, bn)}</span>
      </div>
      <div className="text-sm">
        {o.qty} × {itemLabel(o.item, bn)} · <b>৳{o.total}</b> · {o.pay === "COD" ? t("Cash Due", "ক্যাশ বাকি") : payLabel(o.pay, bn)}
      </div>
      <div className="muted text-sm">
        🕒 {slotLabel(o.slot, bn)} {o.rescheduled && <span className="chip chip-aqua">{t("Rescheduled", "সময় পরিবর্তিত")}</span>}
      </div>
      {o.eta && <div className="panel text-sm font-medium">🚴 {t("Arriving", "আসবে")} {etaText(o.eta, bn)}</div>}

      {editing ? (
        <div className="panel space-y-2">
          <select className="input" value={slot} onChange={(e) => setSlot(e.target.value as SlotKey)}>
            {SLOTS.map((s) => <option key={s.key} value={s.key}>{bn ? s.bn : s.en}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="btn" onClick={() => { reschedule(o.id, slot); setEditing(false); }}>{t("Save new time", "নতুন সময় সংরক্ষণ")}</button>
            <button className="btn-outline" onClick={() => { setSlot(o.slot); setEditing(false); }}>{t("Cancel", "বাতিল")}</button>
          </div>
        </div>
      ) : (
        <button className="btn-outline" onClick={() => setEditing(true)}>🔁 {t("Reschedule time", "সময় পরিবর্তন করুন")}</button>
      )}

      <SwipeButton label={t("Swipe to confirm received", "পেয়েছি — সোয়াইপ করুন")} onComplete={() => markReceived(o.id)} />
    </div>
  );
}

function Inner() {
  const { user, orders, companies } = useStore();
  const { t, bn } = useLang();
  const mine = orders.filter((o) => o.customerId === user!.id);
  const pending = mine.filter((o) => o.status === "Pending" || o.status === "Scheduled");
  const received = mine.filter((o) => o.status === "Received");
  const done = mine.filter((o) => o.status === "Completed");

  return (
    <div className="space-y-6">
      <Back href="/student" />
      <h1 className="text-xl font-bold">📦 {t("My orders", "আমার অর্ডার")}</h1>
      {mine.length === 0 && <p className="muted text-sm">{t("No orders yet.", "এখনো কোনো অর্ডার নেই।")}</p>}

      <section className="space-y-3">
        <h2 className="font-semibold">{t("Pending", "অপেক্ষমাণ")} ({pending.length})</h2>
        {pending.length === 0 && <p className="muted text-sm">—</p>}
        {pending.map((o) => <PendingCard key={o.id} o={o} />)}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">{t("Received (waiting for vendor to close)", "গ্রহণ করা হয়েছে (ভেন্ডরের সম্পন্ন করার অপেক্ষায়)")} ({received.length})</h2>
        {received.length === 0 && <p className="muted text-sm">—</p>}
        {received.map((o) => (
          <div key={o.id} className="card space-y-1">
            <div className="flex items-center justify-between">
              <b>{o.id} · {companies.find((c) => c.id === o.companyId)?.name}</b>
              <span className={`chip ${badge[o.status]}`}>{statusLabel(o.status, bn)}</span>
            </div>
            <div className="text-sm">{o.qty} × {itemLabel(o.item, bn)} · <b>৳{o.total}</b></div>
            <p className="muted text-xs">{t("The vendor will confirm payment and complete the order.", "ভেন্ডর পেমেন্ট নিশ্চিত করে অর্ডার সম্পন্ন করবে।")}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">{t("Completed", "সম্পন্ন")} ({done.length})</h2>
        {done.length === 0 && <p className="muted text-sm">—</p>}
        {done.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "#bae6fd" }}>
            <span>{o.id} · {o.qty} × {itemLabel(o.item, bn)}</span>
            <span><b>৳{o.total}</b> ✅</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function MyOrdersPage() {
  return <Guard role="student"><Inner /></Guard>;
}