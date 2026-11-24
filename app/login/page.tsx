"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { INITIAL_USERS, dashboardPath } from "@/lib/data";

export default function LoginPage() {
  const { login, users } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const e = login(email, password);
    if (e) return setErr(e);
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    router.push(u ? dashboardPath(u.role) : "/");
  };

  const demos = INITIAL_USERS.filter((u) => u.id !== "u-staff2");

  return (
    <div className="mx-auto max-w-md space-y-4 pt-4">
      <section className="card space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <label className="block text-sm font-medium">Email
          <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">Password
          <input className="input mt-1" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </label>
        {err && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{err}</p>}
        <button className="btn w-full" onClick={submit}>Login</button>
        <p className="muted text-sm">
          New student? <Link href="/register" style={{ color: "#1d4ed8", fontWeight: 600 }}>Create an account</Link>
        </p>
      </section>

      <section className="panel space-y-2">
        <div className="text-sm font-semibold">Demo accounts (tap to fill)</div>
        <div className="flex flex-wrap gap-2">
          {demos.map((u) => (
            <button key={u.id} className="btn-outline" style={{ padding: "6px 12px", fontSize: 13 }}
              onClick={() => { setEmail(u.email); setPassword(u.password); setErr(""); }}>
              {u.role === "admin" ? "Admin" : u.role === "staff" ? "Staff" : "Student"}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}