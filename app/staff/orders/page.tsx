"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import SwipeButton from "@/components/SwipeButton";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back, CountTabs, Shot } from "@/components/UI";
import { Order, etaText, floorLabel, itemLabel, slotLabel } from "@/lib/data";

function Card({ o }: { o: Order }) {
  const { user, sendEta, complete } = useStore();
  const { t, bn } = useLang();
  const [custom, setCustom] = useState("");

  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{o.id} · {o.customer}</div>
          <a href={`tel:${o.phone}`} className="text-sm font-medium" style={{ color: "#1d4ed8" }}>📞 {o.phone}</a>
        </div>
        <div className="rounded-lg px-3 py-1 text-center" style={{ background: "#0b1220", color: "#fff" }}>
          <div className="text-[10px] uppercase" style={{ color: "#22d3ee" }}>{t("Floor", "তলা")}</div>
          <div className="text-lg font-bold">{floorLabel(o.floor, bn)}</div>
        </div>
      </div>

      <div className="muted text-sm">📍 {o.building}</div>
      <div className="text-sm">{o.qty} × {itemLabel(o.item, bn)} · <b>৳{o.total}</b></div>

      <div className="flex flex-wrap gap-2">
        <span className={`chip ${o.pay === "COD" ? "chip-dark" : "chip-blue"}`}>
          {o.pay === "COD" ? t("Cash Due", "ক্যাশ বাকি") : `${o.pay}${o.trxId ? " · " + o.trxId : ""}`}
        </span>
        <span className="chip chip-gray">🕒 {slotLabel(o.slot, bn)}</span>
        {o.rescheduled && <span className="chip chip-aqua">{t("Rescheduled", "সময় পরিবর্তিত")}</span>}
        {o.status === "Received" && <span className="chip chip-aqua">✔ {t("Received by Student", "শিক্ষার্থী গ্রহণ করেছে")}</span>}
        {o.eta && <span className="chip chip-aqua">ETA {etaText(o.eta, bn)}</span>}
      </div>

      {o.pay !== "COD" && (
        <div className="panel flex items-center gap-3 text-sm">
          {o.screenshot ? <Shot src={o.screenshot} /> : <span className="muted">{t("No screenshot", "স্ক্রিনশট নেই")}</span>}
          <div>
            {o.senderPhone && <div>{t("Sender", "প্রেরক")}: <b>{o.senderPhone}</b></div>}
            {o.screenshot && <div className="muted text-xs">{t("Tap image to enlarge", "বড় করতে ছবিতে ট্যাপ করুন")}</div>}
          </div>
        </div>
      )}

      {o.status !== "Received" && (
        <div className="flex flex-wrap gap-2">
          {["20", "45"].map((m) => (
            <button key={m} onClick={() => sendEta(o.id, m)} className="btn-outline" style={{ padding: "8px 12px", fontSize: 14 }}>
              {t(`Send ETA: ${m} min`, `ETA পাঠান: ${m} মিনিট`)}
            </button>
          ))}
          <input value={custom} onChange={(e) => setCustom(e.target.value)}
            placeholder={t("Custom e.g. 5:30 PM", "নিজে লিখুন, যেমন বিকাল ৫:৩০")} className="input min-w-0 flex-1" />
          <button disabled={!custom.trim()} onClick={() => { sendEta(o.id, custom.trim()); setCustom(""); }}
            className="btn" style={{ padding: "8px 14px", fontSize: 14 }}>{t("Send", "পাঠান")}</button>
        </div>
      )}

      <SwipeButton variant="dark" label={t("Swipe right to complete", "সম্পন্ন করতে সোয়াইপ করুন")}
        onComplete={() => complete(o.id, user!.id)} />
    </div>
  );
}

function Inner() {
  const { user, orders, companies } = useStore();
  const { t, bn } = useLang();
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const company = companies.find((c) => c.id === user!.companyId);
  const mine = orders.filter((o) => o.companyId === user!.companyId);
  const pending = mine.filter((o) => o.status !== "Completed");
  const done = mine.filter((o) => o.status === "Completed");

  return (
    <div className="space-y-4">
      <Back href="/staff" />
      <h1 className="text-xl font-bold">📋 {company?.name} — {t("Orders", "অর্ডার")}</h1>
      <CountTabs value={tab} onChange={setTab} tabs={[
        { key: "pending", label: t("Pending", "অপেক্ষমাণ"), count: pending.length },
        { key: "done", label: t("Completed", "সম্পন্ন"), count: done.length },
      ]} />

      {tab === "pending" && (
        <>
          {pending.length === 0 && <p className="muted">{t("No pending orders 🎉", "কোনো অপেক্ষমাণ অর্ডার নেই 🎉")}</p>}
          {pending.map((o) => <Card key={o.id} o={o} />)}
        </>
      )}

      {tab === "done" && (
        <>
          {done.length === 0 && <p className="muted">{t("No completed orders yet.", "এখনো কোনো সম্পন্ন অর্ডার নেই।")}</p>}
          {done.map((o) => (
            <div key={o.id} className="card text-sm">
              <div className="flex justify-between">
                <b>{o.id} · {o.customer}</b><span>✅ ৳{o.total}</span>
              </div>
              <div className="muted">{o.qty} × {itemLabel(o.item, bn)} · {o.pay === "COD" ? t("Cash", "ক্যাশ") : o.pay}</div>
              {o.completedAt && <div className="muted text-xs">{new Date(o.completedAt).toLocaleString()}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function StaffOrdersPage() {
  return <Guard role="staff"><Inner /></Guard>;
}