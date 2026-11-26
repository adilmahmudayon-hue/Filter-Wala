"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { BigTile, Field, FloorSelect } from "@/components/UI";
import { ADMIN_CODE, ROLE_INFO, Role } from "@/lib/data";

export default function RegisterPage() {
  const { register, signup, companies } = useStore();
  const { t, bn, err } = useLang();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [f, setF] = useState({
    name: "", phone: "", email: "", password: "", studentId: "", building: "", area: "",
    floor: 0, companyId: companies[0]?.id ?? "", code: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const set = (k: string, v: string | number) => setF((x) => ({ ...x, [k]: v }));

  if (!role) {
    return (
      <div className="mx-auto max-w-md space-y-3 pt-4">
        <h1 className="text-xl font-bold">{t("Register as…", "কোন ভূমিকায় রেজিস্টার করবেন?")}</h1>
        {(Object.keys(ROLE_INFO) as Role[]).map((r) => (
          <BigTile key={r} emoji={ROLE_INFO[r].emoji} onClick={() => setRole(r)}
            title={t(`Register as ${ROLE_INFO[r].en}`, `${ROLE_INFO[r].bn} হিসেবে রেজিস্টার`)}
            sub={bn ? ROLE_INFO[r].subBn : ROLE_INFO[r].subEn} />
        ))}
        <p className="muted text-sm">
          {t("Already registered?", "আগেই রেজিস্টার করেছেন?")}{" "}
          <Link href="/login" style={{ color: "#1d4ed8", fontWeight: 600 }}>{t("Login", "লগইন")}</Link>
        </p>
      </div>
    );
  }

  const info = ROLE_INFO[role];

  const submit = () => {
    setError("");
    const base = !f.name || !f.phone || !f.email;
    if (base || (role === "student" && (!f.studentId || !f.building || !f.area)))
      return setError(t("Please fill in all fields.", "অনুগ্রহ করে সব ঘর পূরণ করুন।"));
    if (f.password.length < 6) return setError(t("Password must be at least 6 characters.", "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"));

    if (role === "student") {
      const e = register({ name: f.name, phone: f.phone, email: f.email, password: f.password,
        studentId: f.studentId, building: f.building, area: f.area, floor: f.floor });
      if (e) return setError(err(e));
      return router.push("/student");
    }
    if (role === "staff") {
      if (!f.companyId) return setError(t("Select your company.", "আপনার কোম্পানি বেছে নিন।"));
      const e = signup({ role: "staff", name: f.name, phone: f.phone, email: f.email, password: f.password,
        companyId: f.companyId, pending: true });
      if (e) return setError(err(e));
      return setDone(t("Request sent! You can log in after the admin approves your account.",
        "অনুরোধ পাঠানো হয়েছে! অ্যাডমিন অনুমোদন করলে আপনি লগইন করতে পারবেন।"));
    }
    if (f.code !== ADMIN_CODE) return setError(t("Invalid admin invite code.", "অ্যাডমিন আমন্ত্রণ কোডটি সঠিক নয়।"));
    const e = signup({ role: "admin", name: f.name, phone: f.phone, email: f.email, password: f.password });
    if (e) return setError(err(e));
    setDone(t("Admin account created. You can log in now.", "অ্যাডমিন অ্যাকাউন্ট তৈরি হয়েছে। এখন লগইন করতে পারেন।"));
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-3 pt-4">
        <section className="card space-y-3 text-center">
          <div className="text-4xl">✅</div>
          <p className="font-medium">{done}</p>
          <Link href="/login" className="btn">{t("Go to login", "লগইনে যান")}</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md pt-4">
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{info.emoji} {t(`Register as ${info.en}`, `${info.bn} হিসেবে রেজিস্টার`)}</h1>
          <button className="text-sm font-medium" style={{ color: "#1d4ed8" }} onClick={() => { setRole(null); setError(""); }}>
            {t("Change", "পরিবর্তন")}
          </button>
        </div>

        <Field label={t("Full name", "পূর্ণ নাম")} value={f.name} onChange={(v) => set("name", v)} />
        <Field label={t("Phone number", "ফোন নম্বর")} type="tel" value={f.phone} onChange={(v) => set("phone", v)} />
        <Field label={t("Email", "ইমেইল")} type="email" value={f.email} onChange={(v) => set("email", v)} />

        {role === "student" && (
          <>
            <Field label={t("Student ID", "স্টুডেন্ট আইডি")} value={f.studentId} onChange={(v) => set("studentId", v)} />
            <Field label={t("Building name / House no.", "বিল্ডিংয়ের নাম / বাড়ি নম্বর")} value={f.building} onChange={(v) => set("building", v)} />
            <Field label={t("Street / Area", "রাস্তা / এলাকা")} value={f.area} onChange={(v) => set("area", v)} />
            <label className="block text-sm font-medium">{t("Floor", "তলা")}
              <div className="mt-1"><FloorSelect value={f.floor} onChange={(v) => set("floor", v)} /></div>
            </label>
          </>
        )}

        {role === "staff" && (
          <label className="block text-sm font-medium">{t("Your company", "আপনার কোম্পানি")}
            <select className="input mt-1" value={f.companyId} onChange={(e) => set("companyId", e.target.value)}>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        )}

        {role === "admin" && (
          <Field label={t("Admin invite code", "অ্যাডমিন আমন্ত্রণ কোড")} value={f.code} onChange={(v) => set("code", v)} />
        )}

        <Field label={t("Password", "পাসওয়ার্ড")} type="password" value={f.password} onChange={(v) => set("password", v)} />

        {role === "staff" && (
          <p className="muted text-xs">{t("Staff accounts must be approved by the admin before login.", "স্টাফ অ্যাকাউন্টে লগইনের আগে অ্যাডমিনের অনুমোদন লাগবে।")}</p>
        )}
        {error && <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="btn w-full" onClick={submit}>{t("Create account", "অ্যাকাউন্ট তৈরি করুন")}</button>
      </section>
    </div>
  );
}