"use client";
import { useState } from "react";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back, Field, FloorSelect } from "@/components/UI";
import { ROLE_INFO, dashboardPath } from "@/lib/data";

function Inner() {
  const { user, companies, updateUser, changePassword } = useStore();
  const { t, bn, err } = useLang();
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
    setSaved(t("Profile saved ✔", "প্রোফাইল সংরক্ষিত ✔"));
  };

  const pw = () => {
    if (newPw !== conf) return setPwMsg({ ok: false, text: t("New passwords don't match.", "নতুন পাসওয়ার্ড দুটি মিলছে না।") });
    const e = changePassword(u.id, oldPw, newPw);
    if (e) return setPwMsg({ ok: false, text: err(e) });
    setOldPw(""); setNewPw(""); setConf("");
    setPwMsg({ ok: true, text: t("Password changed ✔", "পাসওয়ার্ড পরিবর্তন হয়েছে ✔") });
  };

  return (
    <div className="space-y-6">
      <Back href={dashboardPath(u.role)} />
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("My Profile", "আমার প্রোফাইল")}</h1>
          <span className="chip chip-dark">{bn ? ROLE_INFO[u.role].bn : ROLE_INFO[u.role].en}</span>
        </div>
        {company && <p className="muted text-sm">{t("Company", "কোম্পানি")}: <b style={{ color: "#0b1220" }}>{company.name}</b></p>}
        <Field label={t("Full name", "পূর্ণ নাম")} value={f.name} onChange={(v) => set("name", v)} />
        <Field label={t("Phone number", "ফোন নম্বর")} type="tel" value={f.phone} onChange={(v) => set("phone", v)} />
        <Field label={t("Email", "ইমেইল")} type="email" value={f.email} onChange={(v) => set("email", v)} />
        {u.role === "student" && (
          <>
            <Field label={t("Student ID", "স্টুডেন্ট আইডি")} value={f.studentId} onChange={(v) => set("studentId", v)} />
            <Field label={t("Building name / House no.", "বিল্ডিংয়ের নাম / বাড়ি নম্বর")} value={f.building} onChange={(v) => set("building", v)} />
            <Field label={t("Street / Area", "রাস্তা / এলাকা")} value={f.area} onChange={(v) => set("area", v)} />
            <label className="block text-sm font-medium">{t("Floor", "তলা")}
              <div className="mt-1"><FloorSelect value={f.floor} onChange={(v) => set("floor", v)} /></div>
            </label>
            <p className="muted text-xs">{t("Your floor decides your delivery charge. Update it if you move.", "আপনার তলা অনুযায়ী ডেলিভারি চার্জ হয়। স্থান বদলালে হালনাগাদ করুন।")}</p>
          </>
        )}
        {saved && <p className="text-sm font-medium" style={{ color: "#155e75" }}>{saved}</p>}
        <button className="btn w-full" onClick={save}>{t("Save changes", "পরিবর্তন সংরক্ষণ করুন")}</button>
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-bold">{t("Change password", "পাসওয়ার্ড পরিবর্তন")}</h2>
        <input className="input" type="password" placeholder={t("Current password", "বর্তমান পাসওয়ার্ড")} value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
        <input className="input" type="password" placeholder={t("New password (min 6 characters)", "নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)")} value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        <input className="input" type="password" placeholder={t("Confirm new password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")} value={conf} onChange={(e) => setConf(e.target.value)} />
        {pwMsg && <p className="text-sm font-medium" style={{ color: pwMsg.ok ? "#155e75" : "#b91c1c" }}>{pwMsg.text}</p>}
        <button className="btn w-full" onClick={pw}>{t("Update password", "পাসওয়ার্ড আপডেট করুন")}</button>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return <Guard><Inner /></Guard>;
}