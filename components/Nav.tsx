"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { dashboardPath } from "@/lib/data";

export default function Nav() {
  const { user, logout, ready } = useStore();
  const { t, lang, setLang } = useLang();
  const router = useRouter();

  return (
    <header style={{ background: "#0b1220" }} className="sticky top-0 z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" style={{ color: "#22d3ee" }} className="text-lg font-bold">💧 Filter Wala</Link>
        <nav className="flex items-center gap-3 text-sm font-medium" style={{ color: "#fff" }}>
          {ready && user ? (
            <>
              <Link href={dashboardPath(user.role)}>{t("Dashboard", "ড্যাশবোর্ড")}</Link>
              <Link href="/profile">{t("Profile", "প্রোফাইল")}</Link>
              <button onClick={() => { logout(); router.push("/"); }}
                style={{ color: "#22d3ee", fontWeight: 600, cursor: "pointer" }}>{t("Logout", "লগআউট")}</button>
            </>
          ) : (
            <>
              <Link href="/login">{t("Login", "লগইন")}</Link>
              <Link href="/register" style={{ color: "#22d3ee" }}>{t("Register", "রেজিস্টার")}</Link>
            </>
          )}
          <button onClick={() => setLang(lang === "en" ? "bn" : "en")}
            style={{ border: "1.5px solid #22d3ee", color: "#22d3ee", borderRadius: 999, padding: "2px 10px", fontWeight: 700, cursor: "pointer" }}>
            {lang === "en" ? "বাং" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}