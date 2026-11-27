"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import PriceEditor from "@/components/PriceEditor";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back, CountTabs, Field } from "@/components/UI";

function Inner() {
  const { companies, orders, updateCompany, addCompany } = useStore();
  const { t } = useLang();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [n, setN] = useState({ name: "", phone: "", areas: "" });

  const active = companies.filter((c) => c.active);
  const inactive = companies.filter((c) => !c.active);
  const list = tab === "active" ? active : inactive;
  const doneCount = (id: string) => orders.filter((o) => o.companyId === id && o.status === "Completed").length;

  const add = () => {
    if (!n.name.trim()) return;
    addCompany(n.name.trim(), n.phone.trim(), n.areas.split(",").map((a) => a.trim()).filter(Boolean));
    setN({ name: "", phone: "", areas: "" });
    setAdding(false);
    setTab("active");
  };

  return (
    <div className="space-y-4">
      <Back href="/admin" />
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">🏢 {t("Companies", "কোম্পানি")}</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? t("Close", "বন্ধ") : `＋ ${t("Add new company", "নতুন কোম্পানি")}`}</button>
      </div>

      {adding && (
        <div className="card space-y-3">
          <Field label={t("Company name", "কোম্পানির নাম")} value={n.name} onChange={(v) => setN({ ...n, name: v })} />
          <Field label={t("Phone", "ফোন")} value={n.phone} onChange={(v) => setN({ ...n, phone: v })} />
          <Field label={t("Coverage areas (comma separated)", "সেবা এলাকা (কমা দিয়ে লিখুন)")} value={n.areas} onChange={(v) => setN({ ...n, areas: v })} />
          <button className="btn w-full" disabled={!n.name.trim()} onClick={add}>{t("Create company", "কোম্পানি তৈরি করুন")}</button>
        </div>
      )}

      <CountTabs value={tab} onChange={setTab} tabs={[
        { key: "active", label: t("Active", "সক্রিয়"), count: active.length },
        { key: "inactive", label: t("Inactive", "নিষ্ক্রিয়"), count: inactive.length },
      ]} />

      {list.length === 0 && <p className="muted text-sm">—</p>}
      {list.map((c) => (
        <div key={c.id} className="card space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <b className="text-lg">{c.name}</b>
              <div className="muted text-sm">📍 {c.areas.join(", ") || "—"} · 📞 {c.phone || "—"}</div>
            </div>
            <div className="rounded-lg px-3 py-1 text-center" style={{ background: "#0b1220", color: "#fff" }}>
              <div className="text-[10px]" style={{ color: "#22d3ee" }}>{t("Completed", "সম্পন্ন")}</div>
              <div className="text-lg font-bold">{doneCount(c.id)}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => setOpen(open === c.id ? null : c.id)}>
              {open === c.id ? t("Hide details", "বিস্তারিত লুকান") : t("Edit details", "তথ্য সম্পাদনা")}
            </button>
            <button className="btn-outline" onClick={() => updateCompany(c.id, { active: !c.active })}>
              {c.active ? t("Deactivate", "নিষ্ক্রিয় করুন") : t("Activate", "সক্রিয় করুন")}
            </button>
          </div>

          {open === c.id && (
            <div className="space-y-3">
              <Field label={t("Company name", "কোম্পানির নাম")} value={c.name} onChange={(v) => updateCompany(c.id, { name: v })} />
              <div className="grid gap-2 sm:grid-cols-3">
                <Field label={t("Phone", "ফোন")} value={c.phone} onChange={(v) => updateCompany(c.id, { phone: v })} />
                <Field label="bKash" value={c.bkash} onChange={(v) => updateCompany(c.id, { bkash: v })} />
                <Field label="Nagad" value={c.nagad} onChange={(v) => updateCompany(c.id, { nagad: v })} />
              </div>
              <Field label={t("Coverage areas (comma separated)", "সেবা এলাকা (কমা দিয়ে লিখুন)")} value={c.areas.join(", ")}
                onChange={(v) => updateCompany(c.id, { areas: v.split(",").map((a) => a.trim()).filter(Boolean) })} />
              <PriceEditor companyId={c.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminCompanies() {
  return <Guard role="admin"><Inner /></Guard>;
}