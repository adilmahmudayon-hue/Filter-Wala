"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back, CountTabs, Field, FloorSelect } from "@/components/UI";

function Inner() {
  const { users, orders, updateUser, signup } = useStore();
  const { t, err } = useLang();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", studentId: "", building: "", area: "", floor: 0 });

  const students = users.filter((u) => u.role === "student");
  const active = students.filter((u) => !u.suspended);
  const inactive = students.filter((u) => u.suspended);
  const list = (tab === "active" ? active : inactive).filter((u) =>
    `${u.name} ${u.email} ${u.phone} ${u.studentId}`.toLowerCase().includes(q.toLowerCase()));
  const doneCount = (id: string) => orders.filter((o) => o.customerId === id && o.status === "Completed").length;

  const add = () => {
    if (!f.name || !f.email || !f.studentId || !f.building || f.password.length < 6)
      return setMsg(t("Fill all fields (password 6+ characters).", "সব ঘর পূরণ করুন (পাসওয়ার্ড ৬+ অক্ষর)।"));
    const e = signup({ role: "student", ...f });
    if (e) return setMsg(err(e));
    setF({ name: "", email: "", phone: "", password: "", studentId: "", building: "", area: "", floor: 0 });
    setMsg(""); setAdding(false); setTab("active");
  };

  const reset = (email: string, id: string) => {
    updateUser(id, { password: "reset123" });
    alert(t(`Password for ${email} reset to: reset123`, `${email}-এর পাসওয়ার্ড রিসেট হয়েছে: reset123`));
  };

  return (
    <div className="space-y-4">
      <Back href="/admin" />
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">🎓 {t("Students", "শিক্ষার্থী")}</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? t("Close", "বন্ধ") : `＋ ${t("Add new student", "নতুন শিক্ষার্থী")}`}</button>
      </div>

      {adding && (
        <div className="card space-y-3">
          <Field label={t("Full name", "পূর্ণ নাম")} value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Field label={t("Email", "ইমেইল")} value={f.email} onChange={(v) => setF({ ...f, email: v })} />
          <Field label={t("Phone", "ফোন")} value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
          <Field label={t("Student ID", "স্টুডেন্ট আইডি")} value={f.studentId} onChange={(v) => setF({ ...f, studentId: v })} />
          <Field label={t("Building / House no.", "বিল্ডিং / বাড়ি নম্বর")} value={f.building} onChange={(v) => setF({ ...f, building: v })} />
          <Field label={t("Street / Area", "রাস্তা / এলাকা")} value={f.area} onChange={(v) => setF({ ...f, area: v })} />
          <FloorSelect value={f.floor} onChange={(v) => setF({ ...f, floor: v })} />
          <Field label={t("Temporary password", "অস্থায়ী পাসওয়ার্ড")} value={f.password} onChange={(v) => setF({ ...f, password: v })} />
          {msg && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{msg}</p>}
          <button className="btn w-full" onClick={add}>{t("Create student account", "শিক্ষার্থীর অ্যাকাউন্ট তৈরি করুন")}</button>
        </div>
      )}

      <CountTabs value={tab} onChange={setTab} tabs={[
        { key: "active", label: t("Active", "সক্রিয়"), count: active.length },
        { key: "inactive", label: t("Inactive", "নিষ্ক্রিয়"), count: inactive.length },
      ]} />

      <input className="input" placeholder={t("Search name, email, phone or student ID", "নাম, ইমেইল, ফোন বা স্টুডেন্ট আইডি খুঁজুন")}
        value={q} onChange={(e) => setQ(e.target.value)} />

      {list.length === 0 && <p className="muted text-sm">—</p>}
      {list.map((u) => (
        <div key={u.id} className="card space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <b>{u.name}</b>
              <div className="muted text-sm">{u.email} · {u.phone} · ID {u.studentId}</div>
            </div>
            <div className="rounded-lg px-3 py-1 text-center" style={{ background: "#0b1220", color: "#fff" }}>
              <div className="text-[10px]" style={{ color: "#22d3ee" }}>{t("Completed", "সম্পন্ন")}</div>
              <div className="text-lg font-bold">{doneCount(u.id)}</div>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="input" value={u.building ?? ""} onChange={(e) => updateUser(u.id, { building: e.target.value })} />
            <input className="input" value={u.area ?? ""} onChange={(e) => updateUser(u.id, { area: e.target.value })} />
            <FloorSelect value={u.floor ?? 0} onChange={(v) => updateUser(u.id, { floor: v })} />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => reset(u.email, u.id)}>{t("Reset password", "পাসওয়ার্ড রিসেট")}</button>
            <button className="btn-outline" onClick={() => updateUser(u.id, { suspended: !u.suspended })}>
              {u.suspended ? t("Unsuspend", "স্থগিত তুলুন") : t("Suspend", "স্থগিত করুন")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminStudents() {
  return <Guard role="admin"><Inner /></Guard>;
}