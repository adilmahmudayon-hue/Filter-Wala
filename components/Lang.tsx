"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "bn";

const ERR: Record<string, [string, string]> = {
  login_wrong: ["Wrong email or password.", "ইমেইল বা পাসওয়ার্ড ভুল।"],
  role_mismatch: ["This account is not registered for the selected role.", "এই অ্যাকাউন্টটি নির্বাচিত ভূমিকার জন্য নয়।"],
  pending: ["Your account is waiting for admin approval.", "আপনার অ্যাকাউন্ট অ্যাডমিনের অনুমোদনের অপেক্ষায় আছে।"],
  suspended: ["This account is suspended. Contact support.", "এই অ্যাকাউন্টটি স্থগিত। সাপোর্টের সাথে যোগাযোগ করুন।"],
  email_taken: ["That email is already registered.", "এই ইমেইল ইতিমধ্যে নিবন্ধিত।"],
  pw_wrong: ["Current password is incorrect.", "বর্তমান পাসওয়ার্ড সঠিক নয়।"],
  pw_short: ["New password must be at least 6 characters.", "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"],
};

type Ctx = {
  lang: Lang; bn: boolean; setLang: (l: Lang) => void;
  t: (en: string, bn: string) => string; err: (code: string) => string;
};

const C = createContext<Ctx>({
  lang: "en", bn: false, setLang: () => {}, t: (en) => en, err: (c) => c,
});
export const useLang = () => useContext(C);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const l = localStorage.getItem("fw-lang");
      if (l === "bn" || l === "en") setLangState(l);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("fw-lang", l); } catch {}
  };

  const bn = lang === "bn";
  const value: Ctx = {
    lang, bn, setLang,
    t: (en, b) => (bn ? b : en),
    err: (code) => (ERR[code] ? ERR[code][bn ? 1 : 0] : code),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}