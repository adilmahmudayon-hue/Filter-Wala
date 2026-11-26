"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { BigTile, Field } from "@/components/UI";
import { INITIAL_USERS, ROLE_INFO, Role, dashboardPath } from "@/lib/data";

export default function LoginPage() {
  const { login } = useStore();
  const { t, bn, err } = useLang();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!role) {
    return (
      <div className="mx-auto max-w-md space-y-3 pt-4">
        <h1 className="text-xl font-bold">{t("Login as…", "কোন ভূমিকায় লগইন করবেন?")}</h1>
        {(Object.keys(ROLE_INFO) as Role[]).map((r) => (
          <BigTile key={r} emoji={ROLE_INFO[r].emoji} onClick={() => setRole(r)}
            title={bn ? ROLE_INFO[r].bn : ROLE_INFO[r].en} sub={bn ? ROLE_INFO[r].subBn : ROLE_INFO[r].subEn} />
        ))}
        <p className="muted text-sm">
          {t("New here?", "নতুন?")}{" "}
          <Link href="/register" style={{ color: "#1d4ed8", fontWeight: 600 }}>{t("Register", "রেজিস্টার করুন")}</Link>
        </p>
      </div>
    );
  }

  const info = ROLE_INFO[role];
  const demo = INITIAL_USERS.find((u) => u.role === role)!;

  const submit = () => {
    const e = login(email, password, role);
    if (e) return setError(err(e));
    router.push(dashboardPath(role));
  };

  return (
    <div className="mx-auto max-w-md space-y-4 pt-4">
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{info.emoji} {t("Login", "লগইন")} — {bn ? info.bn : info.en}</h1>
          <button className="text-sm font-medium" style={{ color: "#1d4ed8" }} onClick={() => { setRole(null); setError(""); }}>
            {t("Change", "পরিবর্তন")}
          </button>
        </div>
        <Field label={t("Email", "ইমেইল")} type="email" value={email} onChange={setEmail} />
        <label className="block text-sm font-medium">{t("Password", "পাসওয়ার্ড")}
          <input className="input mt-1" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </label>
        {error && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="btn w-full" onClick={submit}>{t("Login", "লগইন")}</button>
        <p className="muted text-sm">
          {t("No account?", "অ্যাকাউন্ট নেই?")}{" "}
          <Link href="/register" style={{ color: "#1d4ed8", fontWeight: 600 }}>{t("Register", "রেজিস্টার করুন")}</Link>
        </p>
      </section>

      <section className="panel space-y-2">
        <div className="text-sm font-semibold">{t("Demo account", "ডেমো অ্যাকাউন্ট")}</div>
        <button className="btn-outline" style={{ padding: "6px 12px", fontSize: 13 }}
          onClick={() => { setEmail(demo.email); setPassword(demo.password); setError(""); }}>
          {t("Tap to fill", "ট্যাপ করে পূরণ করুন")}: {demo.email}
        </button>
      </section>
    </div>
  );
}