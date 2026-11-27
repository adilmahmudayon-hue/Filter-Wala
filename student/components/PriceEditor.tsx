"use client";
import { useState } from "react";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { ITEMS } from "@/lib/data";

export default function PriceEditor({ companyId, payment = false }: { companyId: string; payment?: boolean }) {
  const { companies, updateCompany } = useStore();
  const { t, bn } = useLang();
  const c = companies.find((x) => x.id === companyId)!;
  const [prices, setPrices] = useState(c.prices);
  const [bands, setBands] = useState(c.bands);
  const [bkash, setBkash] = useState(c.bkash);
  const [nagad, setNagad] = useState(c.nagad);
  const [msg, setMsg] = useState("");

  const save = () => {
    updateCompany(c.id, payment ? { prices, bands, bkash: bkash.trim(), nagad: nagad.trim() } : { prices, bands });
    setMsg(t("Saved ✔ New orders will use these details.", "সংরক্ষিত ✔ নতুন অর্ডারে এই তথ্য ব্যবহার হবে।"));
  };

  const num = (val: number, onChange: (n: number) => void) => (
    <input type="number" min={0} className="input" style={{ width: 100, textAlign: "right" }}
      value={val} onChange={(e) => { onChange(+e.target.value); setMsg(""); }} />
  );

  const payRow = (label: string, val: string, set: (v: string) => void) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span className={`chip ${val.trim() ? "chip-aqua" : "chip-dark"}`}>
          {val.trim() ? t("Available to customers", "গ্রাহকদের জন্য চালু") : t("Not available to customers", "গ্রাহকদের জন্য বন্ধ")}
        </span>
      </div>
      <input className="input" placeholder="01XXXXXXXXX" value={val} onChange={(e) => { set(e.target.value); setMsg(""); }} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-semibold">{t("Item prices (৳)", "আইটেমের দাম (৳)")}</h3>
        <div className="card divide-y" style={{ padding: 0 }}>
          {ITEMS.map((i) => (
            <div key={i.key} className="flex items-center justify-between gap-2 p-3 text-sm">
              <span>{bn ? i.bn : i.en}</span>
              {num(prices[i.key], (n) => setPrices({ ...prices, [i.key]: n }))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold">{t("Floor charge (৳ per item)", "ফ্লোর চার্জ (৳ প্রতি আইটেম)")}</h3>
        <div className="card divide-y" style={{ padding: 0 }}>
          {bands.map((b, i) => (
            <div key={b.label} className="flex items-center justify-between gap-2 p-3 text-sm">
              <span>{bn ? b.labelBn : b.label}</span>
              {num(b.fee, (n) => setBands(bands.map((x, j) => (j === i ? { ...x, fee: n } : x))))}
            </div>
          ))}
        </div>
      </div>

      {payment && (
        <div className="card space-y-3">
          <h3 className="font-semibold">{t("Mobile payment numbers", "মোবাইল পেমেন্ট নম্বর")}</h3>
          {payRow("bKash", bkash, setBkash)}
          {payRow("Nagad", nagad, setNagad)}
          <p className="muted text-xs">
            {t("No bKash or Nagad account? Leave it blank. Customers will see it as not available and can only choose the methods you offer.",
              "বিকাশ বা নগদ অ্যাকাউন্ট নেই? ফাঁকা রাখুন। গ্রাহকরা এটি 'বন্ধ' দেখবেন এবং শুধু আপনার চালু পদ্ধতি বেছে নিতে পারবেন।")}
          </p>
        </div>
      )}

      {msg && <p className="text-sm font-medium" style={{ color: "#155e75" }}>{msg}</p>}
      <button className="btn w-full" onClick={save}>{t("Save changes", "পরিবর্তন সংরক্ষণ করুন")}</button>
    </div>
  );
}