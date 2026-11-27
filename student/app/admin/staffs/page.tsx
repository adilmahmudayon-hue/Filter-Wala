"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back, CountTabs, Field } from "@/components/UI";

function Inner() {
  const { users, orders, companies, updateUser, signup, removeUser } = useStore();
  const { t, err } = useLang();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", companyId: companies[0]?.id ?? "" });
  const [msg, setMsg] = useState("");

  const staff = users.filter((u) => u.role === "staff");
  const waiting = staff.filter((u) => u.pending);
  const active = staff.filter((u) => !u.pending && !u.suspended);
  const inactive = staff.filter((u) => !u.pending && u.suspended);
  const list = tab === "active" ? active : inactive;
  const doneCount = (id: string) => orders.filter((o) => o.status === "Completed" && o.completedBy === id).length;
  const compName = (id?: string) => companies.find((c) => c.id === id)?.name ?? "—";

  const add = async () => {
  if (!f.name || !f.email || f.password.length < 6)
    return setMsg(t("Name, email and a 6+ character password are required.", "নাম, ইমেইল ও ৬+ অক্ষরের পাসওয়ার্ড দরকার।"));

  const e = await signup({ role: "staff", ...f });

  if (e) return setMsg(err(e));

  setF({ ...f, name: "", email: "", phone: "", password: "" });
  setMsg("");
  setAdding(false);
  setTab("active");
};

  const reset = (email: string, id: string) => {
    updateUser(id, { password: "reset123" });
    alert(t(`Password for ${email} reset to: reset123`, `${email}-এর পাসওয়ার্ড রিসেট হয়েছে: reset123`));
  };

  return (
    <div className="space-y-4">
      <Back href="/admin" />
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">🚴 {t("Staffs", "স্টাফ")}</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? t("Close", "বন্ধ") : `＋ ${t("Add new staff", "নতুন স্টাফ")}`}</button>
      </div>

      {adding && (
        <div className="card space-y-3">
          <Field label={t("Full name", "পূর্ণ নাম")} value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Field label={t("Email", "ইমেইল")} value={f.email} onChange={(v) => setF({ ...f, email: v })} />
          <Field label={t("Phone", "ফোন")} value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
          <Field label={t("Temporary password", "অস্থায়ী পাসওয়ার্ড")} value={f.password} onChange={(v) => setF({ ...f, password: v })} />
          <select className="input" value={f.companyId} onChange={(e) => setF({ ...f, companyId: e.target.value })}>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {msg && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{msg}</p>}
          <button className="btn w-full" onClick={add}>{t("Create staff account", "স্টাফ অ্যাকাউন্ট তৈরি করুন")}</button>
        </div>
      )}

      {waiting.length > 0 && (
        <div className="panel space-y-2">
          <div className="font-semibold">⏳ {t("Waiting for approval", "অনুমোদনের অপেক্ষায়")} ({waiting.length})</div>
          {waiting.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 text-sm">
              <span><b>{u.name}</b> · {u.email} · {compName(u.companyId)}</span>
              <span className="flex gap-2">
                <button className="btn" style={{ padding: "6px 12px" }} onClick={() => updateUser(u.id, { pending: false })}>{t("Approve", "অনুমোদন")}</button>
                <button className="btn-outline" style={{ padding: "6px 12px" }} onClick={() => removeUser(u.id)}>{t("Reject", "বাতিল")}</button>
              </span>
            </div>
          ))}
        </div>
      )}

      <CountTabs value={tab} onChange={setTab} tabs={[
        { key: "active", label: t("Active", "সক্রিয়"), count: active.length },
        { key: "inactive", label: t("Inactive", "নিষ্ক্রিয়"), count: inactive.length },
      ]} />

      {list.length === 0 && <p className="muted text-sm">—</p>}
      {list.map((u) => (
        <div key={u.id} className="card space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <b>{u.name}</b>
              <div className="muted text-sm">{u.email} · {u.phone}</div>
            </div>
            <div className="rounded-lg px-3 py-1 text-center" style={{ background: "#0b1220", color: "#fff" }}>
              <div className="text-[10px]" style={{ color: "#22d3ee" }}>{t("Completed", "সম্পন্ন")}</div>
              <div className="text-lg font-bold">{doneCount(u.id)}</div>
            </div>
          </div>
          <select className="input" value={u.companyId} onChange={(e) => updateUser(u.id, { companyId: e.target.value })}>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => reset(u.email, u.id)}>{t("Reset password", "পাসওয়ার্ড রিসেট")}</button>
            <button className="btn-outline" onClick={() => updateUser(u.id, { suspended: !u.suspended })}>
              {u.suspended ? t("Restore access", "অ্যাক্সেস ফিরিয়ে দিন") : t("Revoke access", "অ্যাক্সেস বাতিল")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminStaffs() {
  return <Guard role="admin"><Inner /></Guard>;
}