
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
    <header
      className="sticky top-0 z-50 border-b border-cyan-100/70 backdrop-blur-xl"
      style={{ background: "rgba(224, 247, 250, 0.88)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-extrabold text-cyan-900"
        >
          💧 Filter Wala
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
          <Link
            href="/"
            className="rounded-full border border-cyan-700/20 bg-white/60 px-4 py-2 text-cyan-900 transition hover:bg-cyan-100"
          >
            🏠 {t("Home", "হোম")}
          </Link>

          {ready && user ? (
            <>
              <Link href={dashboardPath(user.role)}>
                {t("Dashboard", "ড্যাশবোর্ড")}
              </Link>

              <Link href="/profile">
                {t("Profile", "প্রোফাইল")}
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="font-bold text-cyan-800"
              >
                {t("Logout", "লগআউট")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                {t("Login", "লগইন")}
              </Link>

              <Link
                href="/register"
                className="text-cyan-800"
              >
                {t("Register", "রেজিস্টার")}
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="rounded-full border border-cyan-700 px-3 py-1 font-bold text-cyan-900"
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
