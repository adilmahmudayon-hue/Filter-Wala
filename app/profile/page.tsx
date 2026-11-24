"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { floorLabel } from "@/lib/data";

function Inner() {
  const { user, companies, updateUser, changePassword } = useStore();
  const u = user!;
  const [f, setF] = useState({
    name: u.name, phone: u.phone, email: u.email, studentId: u.studentId ?? "",
    building: u.building ?? "", area: u.area ?? "", floor: u.floor ?? 0,
  });
  const [saved, setSaved] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [conf, setConf] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: string, v: string | number) => { setF((x) => ({ ...x, [k]: v })); setSaved(""); };
  const company = companies.find((c) => c.id === u.companyId);

  const save = () => {
    updateUser(u.id, u.role === "student" ? f : { name: f.name, phone: f.phone, email: f.email });
    setSaved("Profile saved ✔");
  };

  const pw = () => {
    if (newPw !== conf) return setPwMsg({ ok: false, text: "New passwords don't match." });
    const e = changePassword(u.id, oldPw, newPw);
    if (e) return setPwMsg({ ok: false, text: e });
    setOldPw(""); setNewPw(""); setConf("");
    setPwMsg({ ok: true, text: "Password changed ✔" });
  };

  const text = (label: string, k: keyof typeof f, type = "text") => (
    <label className="block text-sm font-medium">{label}
      <input className="input mt-1" type={type} value={String(f[k])} onChange={(e) => set(k, e.target.value)} />
    </label>
  );

  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">My Profile</h1>
          <span className="chip chip-dark">{u.role.toUpperCase()}</span>
        </div>
        {company && <p className="muted text-sm">Company: <b style={{ color: "#0b1220" }}>{company.name}</b></p>}
        {text("Full name", "name")}
        {text("Phone number", "phone", "tel")}
        {text("Email", "email", "email")}
        {u.role === "student" && (
          <>
            {text("Student ID", "studentId")}
            {text("Building name / House no.", "building")}
            {text("Street / Area", "area")}
            <label className="block text-sm font-medium">Floor
              <select className="input mt-1" value={f.floor} onChange={(e) => set("floor", +e.target.value)}>
                {Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{floorLabel(i)}</option>)}
              </select>
            </label>
            <p className="muted text-xs">Your floor decides your delivery charge. Update it if you move.</p>
          </>
        )}
        {saved && <p className="text-sm font-medium" style={{ color: "#155e75" }}>{saved}</p>}
        <button className="btn w-full" onClick={save}>Save changes</button>
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-bold">Change password</h2>
        <input className="input" type="password" placeholder="Current password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
        <input className="input" type="password" placeholder="New password (min 6 characters)" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        <input className="input" type="password" placeholder="Confirm new password" value={conf} onChange={(e) => setConf(e.target.value)} />
        {pwMsg && <p className="text-sm font-medium" style={{ color: pwMsg.ok ? "#155e75" : "#b91c1c" }}>{pwMsg.text}</p>}
        <button className="btn w-full" onClick={pw}>Update password</button>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return <Guard><Inner /></Guard>;
}