"use client";
import { useState } from "react";
import { useStore } from "@/components/Store";
import { ITEMS } from "@/lib/data";

export default function PriceEditor({ companyId }: { companyId: string }) {
  const { companies, updateCompany } = useStore();
  const c = companies.find((x) => x.id === companyId)!;
  const [prices, setPrices] = useState(c.prices);
  const [bands, setBands] = useState(c.bands);
  const [msg, setMsg] = useState("");

  const save = () => {
    updateCompany(c.id, { prices, bands });
    setMsg("Prices saved ✔ New orders will use these prices.");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-semibold">Item prices (৳)</h3>
        <div className="card divide-y" style={{ padding: 0 }}>
          {ITEMS.map((i) => (
            <div key={i.key} className="flex items-center justify-between gap-2 p-3 text-sm">
              <span>{i.label}</span>
              <input type="number" min={0} className="input" style={{ width: 100, textAlign: "right" }}
                value={prices[i.key]}
                onChange={(e) => { setPrices({ ...prices, [i.key]: +e.target.value }); setMsg(""); }} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Floor delivery charge (৳ per jar/item)</h3>
        <div className="card divide-y" style={{ padding: 0 }}>
          {bands.map((b, i) => (
            <div key={b.label} className="flex items-center justify-between gap-2 p-3 text-sm">
              <span>{b.label}</span>
              <input type="number" min={0} className="input" style={{ width: 100, textAlign: "right" }}
                value={b.fee}
                onChange={(e) => { setBands(bands.map((x, j) => (j === i ? { ...x, fee: +e.target.value } : x))); setMsg(""); }} />
            </div>
          ))}
        </div>
      </div>

      {msg && <p className="text-sm font-medium" style={{ color: "#155e75" }}>{msg}</p>}
      <button className="btn w-full" onClick={save}>Save price list</button>
    </div>
  );
}