"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { floorLabel } from "@/lib/data";

export default function RegisterPage() {
  const { register } = useStore();
  const router = useRouter();
  const [f, setF] = useState({
    name: "", phone: "", email: "", studentId: "", building: "", area: "", floor: 0, password: "",
  });
  const [err, setErr] = useState("");
  const set = (k: string, v: string | number) => setF((x) => ({ ...x, [k]: v }));

  const submit = () => {
    if (!f.name || !f.phone || !f.email || !f.studentId || !f.building || !f.area)
      return setErr("Please fill in all fields.");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    const e = register(f);
    if (e) return setErr(e);
    router.push("/student");
  };

  const text = (label: string, k: keyof typeof f, type = "text") => (
    <label className="block text-sm font-medium">{label}
      <input className="input mt-1" type={type} value={String(f[k])} onChange={(e) => set(k, e.target.value)} />
    </label>
  );

  return (
    <div className="mx-auto max-w-md pt-4">
      <section className="card space-y-4">
        <h1 className="text-xl font-bold">Student Registration</h1>
        {text("Full name", "name")}
        {text("Phone number", "phone", "tel")}
        {text("Email", "email", "email")}
        {text("Student ID", "studentId")}
        {text("Building name / House no.", "building")}
        {text("Street / Area", "area")}
        <label className="block text-sm font-medium">Floor
          <select className="input mt-1" value={f.floor} onChange={(e) => set("floor", +e.target.value)}>
            {Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{floorLabel(i)}</option>)}
          </select>
        </label>
        {text("Password", "password", "password")}
        {err && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{err}</p>}
        <button className="btn w-full" onClick={submit}>Create account</button>
        <p className="muted text-sm">
          Already registered? <Link href="/login" style={{ color: "#1d4ed8", fontWeight: 600 }}>Login</Link>
        </p>
      </section>
    </div>
  );
}