"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import PriceEditor from "@/components/PriceEditor";
import { useStore } from "@/components/Store";
import { floorLabel } from "@/lib/data";

function Companies() {
  const { companies, updateCompany, addCompany } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [name, setName] = useState("");

  return (
    <div className="space-y-3">
      <div className="card flex gap-2">
        <input className="input" placeholder="New company name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn" disabled={!name.trim()} onClick={() => { addCompany(name.trim()); setName(""); }}>Add</button>
      </div>

      {companies.map((c) => (
        <div key={c.id} className="card space-y-3">
          <div className="flex items-center justify-between">
            <b>{c.name}</b>
            <button onClick={() => updateCompany(c.id, { active: !c.active })}
              className={`chip ${c.active ? "chip-aqua" : "chip-dark"}`} style={{ cursor: "pointer" }}>
              {c.active ? "Active" : "Suspended"}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="text-xs font-medium">Phone
              <input className="input mt-1" value={c.phone} onChange={(e) => updateCompany(c.id, { phone: e.target.value })} />
            </label>
            <label className="text-xs font-medium">bKash number
              <input className="input mt-1" value={c.bkash} onChange={(e) => updateCompany(c.id, { bkash: e.target.value })} />
            </label>
            <label className="text-xs font-medium">Nagad number
              <input className="input mt-1" value={c.nagad} onChange={(e) => updateCompany(c.id, { nagad: e.target.value })} />
            </label>
          </div>
          <label className="block text-xs font-medium">Coverage areas (comma separated)
            <input className="input mt-1" value={c.areas.join(", ")}
              onChange={(e) => updateCompany(c.id, { areas: e.target.value.split(",").map((a) => a.trim()).filter(Boolean) })} />
          </label>
          <button className="btn-outline" onClick={() => setOpen(open === c.id ? null : c.id)}>
            {open === c.id ? "Hide price list" : "Edit price list"}
          </button>
          {open === c.id && <PriceEditor companyId={c.id} />}
        </div>
      ))}
    </div>
  );
}

function StaffTab() {
  const { users, companies, updateUser, addUser } = useStore();
  const staff = users.filter((u) => u.role === "staff");
  const [f, setF] = useState({ name: "", email: "", password: "", phone: "", companyId: companies[0]?.id ?? "" });
  const [msg, setMsg] = useState("");

  const add = () => {
    if (!f.name || !f.email || f.password.length < 6) return setMsg("Name, email and a 6+ character password are required.");
    const e = addUser({ ...f, role: "staff" });
    setMsg(e ?? "Staff account created ✔");
    if (!e) setF({ ...f, name: "", email: "", password: "", phone: "" });
  };

  return (
    <div className="space-y-3">
      <div className="card space-y-2">
        <h3 className="font-semibold">Add staff account</h3>
        <input className="input" placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="input" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="input" placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        <input className="input" placeholder="Temporary password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <select className="input" value={f.companyId} onChange={(e) => setF({ ...f, companyId: e.target.value })}>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {msg && <p className="text-sm font-medium" style={{ color: "#155e75" }}>{msg}</p>}
        <button className="btn w-full" onClick={add}>Create staff account</button>
      </div>

      {staff.map((u) => (
        <div key={u.id} className="card space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <b>{u.name}</b>
              <div className="muted text-sm">{u.email} · {u.phone}</div>
            </div>
            <span className={`chip ${u.suspended ? "chip-dark" : "chip-aqua"}`}>{u.suspended ? "Revoked" : "Active"}</span>
          </div>
          <select className="input" value={u.companyId} onChange={(e) => updateUser(u.id, { companyId: e.target.value })}>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => { updateUser(u.id, { password: "reset123" }); alert(`Password for ${u.email} reset to: reset123`); }}>Reset password</button>
            <button className="btn-outline" onClick={() => updateUser(u.id, { suspended: !u.suspended })}>
              {u.suspended ? "Restore access" : "Revoke access"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentsTab() {
  const { users, updateUser } = useStore();
  const [q, setQ] = useState("");
  const students = users.filter((u) => u.role === "student" &&
    `${u.name} ${u.email} ${u.phone} ${u.studentId}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-3">
      <input className="input" placeholder="Search name, email, phone or student ID" value={q} onChange={(e) => setQ(e.target.value)} />
      {students.length === 0 && <p className="muted text-sm">No students found.</p>}
      {students.map((u) => (
        <div key={u.id} className="card space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <b>{u.name}</b>
              <div className="muted text-sm">{u.email} · {u.phone} · ID {u.studentId}</div>
            </div>
            <span className={`chip ${u.suspended ? "chip-dark" : "chip-aqua"}`}>{u.suspended ? "Suspended" : "Active"}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="input" value={u.building ?? ""} onChange={(e) => updateUser(u.id, { building: e.target.value })} />
            <input className="input" value={u.area ?? ""} onChange={(e) => updateUser(u.id, { area: e.target.value })} />
            <select className="input" value={u.floor ?? 0} onChange={(e) => updateUser(u.id, { floor: +e.target.value })}>
              {Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{floorLabel(i)}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => { updateUser(u.id, { password: "reset123" }); alert(`Password for ${u.email} reset to: reset123`); }}>Reset password</button>
            <button className="btn-outline" onClick={() => updateUser(u.id, { suspended: !u.suspended })}>
              {u.suspended ? "Unsuspend" : "Suspend"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Inner() {
  const [tab, setTab] = useState<"companies" | "staff" | "students">("companies");
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="grid grid-cols-3 gap-2">
        {(["companies", "staff", "students"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`btn-outline ${tab === t ? "on" : ""}`}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "companies" && <Companies />}
      {tab === "staff" && <StaffTab />}
      {tab === "students" && <StudentsTab />}
    </div>
  );
}

export default function AdminPage() {
  return <Guard role="admin"><Inner /></Guard>;
}