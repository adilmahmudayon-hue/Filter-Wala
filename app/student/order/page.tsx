"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back, Field } from "@/components/UI";
import { compressImage } from "@/lib/image";
import { ITEMS, SLOTS, ItemKey, PayMethod, SlotKey, floorFee, floorLabel } from "@/lib/data";

function Inner() {
  const { user, companies, addOrder } = useStore();
  const { t, bn } = useLang();
  const router = useRouter();
  const u = user!;
  const floor = u.floor ?? 0;
  const active = companies.filter((c) => c.active);

  const [companyId, setCompanyId] = useState(active[0]?.id ?? "");
  const [itemKey, setItemKey] = useState<ItemKey>("newJar");
  const [qty, setQty] = useState(1);
  const [slot, setSlot] = useState<SlotKey>("asap");
  const [pay, setPay] = useState<PayMethod>("COD");
  const [trx, setTrx] = useState("");
  const [sender, setSender] = useState("");
  const [shot, setShot] = useState("");
  const [msg, setMsg] = useState("");

  const company = companies.find((c) => c.id === companyId);
  if (!company) return <p className="muted">{t("No vendors available right now.", "এখন কোনো ভেন্ডর পাওয়া যাচ্ছে না।")}</p>;

  const fee = floorFee(company.bands, floor);
  const total = (company.prices[itemKey] + fee) * qty;
  const number = pay === "bKash" ? company.bkash : company.nagad;

  const pickShot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setShot(await compressImage(file)); setMsg(""); }
    catch { setMsg(t("Could not read that image.", "ছবিটি পড়া যায়নি।")); }
  };

  const submit = () => {
    if (pay !== "COD" && (!sender.trim() || !shot)) {
      return setMsg(t("Please add the sender number and a payment screenshot.", "প্রেরকের নম্বর ও পেমেন্টের স্ক্রিনশট দিন।"));
    }
    addOrder({
      companyId, customerId: u.id, customer: u.name, phone: u.phone,
      building: `${u.building}, ${u.area}`, floor, item: itemKey, qty, total, slot, pay,
      trxId: pay === "COD" ? undefined : trx.trim() || undefined,
      senderPhone: pay === "COD" ? undefined : sender.trim(),
      screenshot: pay === "COD" ? undefined : shot,
    });
    router.push("/student/orders");
  };

  const payBtn = (p: PayMethod, label: string, ok: boolean) => (
    <div key={p}>
      <button disabled={!ok} onClick={() => setPay(p)} className={`btn-outline w-full ${pay === p ? "on" : ""}`}>{label}</button>
      {!ok && <div className="muted mt-1 text-center text-[11px]">{t("Not available", "বন্ধ আছে")}</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      <Back href="/student" />
      <section className="card space-y-4">
        <h1 className="text-xl font-bold">🛒 {t("Place an order", "অর্ডার করুন")}</h1>
        <div className="panel text-sm">
          <b>{u.name}</b> · {u.building}, {u.area} · <b>{floorLabel(floor, bn)}</b>
          <div><Link href="/profile" style={{ color: "#1d4ed8", fontWeight: 600 }}>{t("Change address / floor", "ঠিকানা / তলা পরিবর্তন")}</Link></div>
        </div>

        <label className="block text-sm font-medium">{t("Vendor", "ভেন্ডর")}
          <select className="input mt-1" value={companyId}
            onChange={(e) => { setCompanyId(e.target.value); setPay("COD"); }}>
            {active.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <div>
          <div className="mb-1 text-sm font-medium">{t("Item", "আইটেম")}</div>
          <div className="space-y-2">
            {ITEMS.map((i) => (
              <button key={i.key} onClick={() => setItemKey(i.key)} className={`opt ${itemKey === i.key ? "on" : ""}`}>
                <span>{itemKey === i.key ? "◉" : "○"} {bn ? i.bn : i.en}</span>
                <span style={{ color: "#1d4ed8" }}>৳{company.prices[i.key]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t("Quantity", "পরিমাণ")}</span>
          <button className="btn-round" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button className="btn-round" onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <label className="block text-sm font-medium">{t("Preferred time", "পছন্দের সময়")}
          <select className="input mt-1" value={slot} onChange={(e) => setSlot(e.target.value as SlotKey)}>
            {SLOTS.map((s) => <option key={s.key} value={s.key}>{bn ? s.bn : s.en}</option>)}
          </select>
        </label>

        <div>
          <div className="mb-1 text-sm font-medium">{t("Payment", "পেমেন্ট")}</div>
          <div className="grid grid-cols-3 gap-2">
            {payBtn("COD", t("Cash", "ক্যাশ"), true)}
            {payBtn("bKash", "bKash", !!company.bkash)}
            {payBtn("Nagad", "Nagad", !!company.nagad)}
          </div>
        </div>

        {pay !== "COD" && (
          <div className="panel space-y-3">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span>{t(`Send ৳${total} to ${pay}:`, `${pay}-এ ৳${total} পাঠান:`)} <b>{number}</b></span>
              <button className="btn-outline" style={{ padding: "4px 10px", fontSize: 12 }}
                onClick={() => navigator.clipboard?.writeText(number)}>{t("Copy", "কপি")}</button>
            </div>
            <Field label={t("Your sender number", "আপনার প্রেরক নম্বর")} value={sender} onChange={setSender} />
            <Field label={t("Transaction ID (optional)", "ট্রানজেকশন আইডি (ঐচ্ছিক)")} value={trx} onChange={setTrx} />
            <div>
              <div className="mb-1 text-sm font-medium">{t("Payment screenshot", "পেমেন্টের স্ক্রিনশট")}</div>
              <input type="file" accept="image/*" onChange={pickShot} className="text-sm" />
              {shot && <img src={shot} alt="screenshot" style={{ marginTop: 8, width: 110, borderRadius: 10, border: "1.5px solid #7dd3fc" }} />}
            </div>
          </div>
        )}

        <div className="panel text-sm">
          (৳{company.prices[itemKey]} + ৳{fee} {t("floor charge", "ফ্লোর চার্জ")}) × {qty}
          <div className="text-xl font-bold" style={{ color: "#1d4ed8" }}>{t("Total", "মোট")} ৳{total}</div>
        </div>

        {msg && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{msg}</p>}
        <button onClick={submit} className="btn w-full" style={{ padding: 14 }}>{t("Place Order", "অর্ডার নিশ্চিত করুন")}</button>
      </section>
    </div>
  );
}

export default function OrderPage() {
  return <Guard role="student"><Inner /></Guard>;
}