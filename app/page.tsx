"use client";
import Link from "next/link";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { ITEMS, dashboardPath, feeRange } from "@/lib/data";

const problems = [
  { e: "📞", pEn: "Orders missed on phone calls", pBn: "ফোনে অর্ডার মিস হয়",
    sEn: "Order online in a few taps. The vendor sees it instantly.", sBn: "কয়েক ট্যাপেই অর্ডার করুন, ভেন্ডর সাথে সাথে দেখতে পান।" },
  { e: "📒", pEn: "Paper ledgers and payment disputes", pBn: "খাতার হিসাব ও টাকা নিয়ে বিতর্ক",
    sEn: "Every order and payment is recorded, with payment screenshots.", sBn: "প্রতিটি অর্ডার ও পেমেন্ট রেকর্ড থাকে, পেমেন্টের স্ক্রিনশট সহ।" },
  { e: "🪜", pEn: "Arguments over floor-carrying charges", pBn: "তলা অনুযায়ী ভাড়া নিয়ে তর্ক",
    sEn: "Floor-wise charge is added automatically. No haggling.", sBn: "তলা অনুযায়ী চার্জ নিজে থেকেই যোগ হয়। দরদাম নেই।" },
  { e: "⏰", pEn: "No idea when the jar will arrive", pBn: "জার কখন আসবে জানা যায় না",
    sEn: "Pick a time slot and get the vendor's arrival time (ETA).", sBn: "সময় বেছে নিন এবং ভেন্ডরের আসার আনুমানিক সময় (ETA) পান।" },
];

export default function Home() {
  const { user, ready, companies } = useStore();
  const { t, bn } = useLang();
  const active = companies.filter((c) => c.active);

  return (
    <div className="space-y-8 pt-4">
      {/* Welcome */}
      <section className="rounded-2xl p-8 text-center" style={{ background: "#0b1220", color: "#fff" }}>
        <div className="text-5xl">💧</div>
        <h1 className="mt-2 text-3xl font-bold">{t("Welcome to Filter Wala!", "Filter Wala-তে স্বাগতম!")}</h1>
        <p className="mt-2" style={{ color: "#a5f3fc" }}>
          {t("Fresh drinking water, delivered right to your door. We're happy to have you here.",
            "বিশুদ্ধ খাবার পানি পৌঁছে যাবে আপনার দরজায়। আপনাকে পেয়ে আমরা আনন্দিত।")}
        </p>
      </section>

      {/* About */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">{t("What is Filter Wala?", "Filter Wala কী?")}</h2>
        <p className="muted">
          {t("Filter Wala is a local water jar and filter delivery platform made for student messes, hostels and apartments. It connects you directly with water companies near you, so you can order in a few taps instead of phone calls and paper ledgers.",
            "Filter Wala হলো স্টুডেন্ট মেস, হোস্টেল ও ফ্ল্যাটের জন্য তৈরি একটি লোকাল পানির জার ও ফিল্টার ডেলিভারি প্ল্যাটফর্ম। এখানে আপনি সরাসরি আপনার এলাকার পানির কোম্পানির কাছ থেকে অর্ডার করতে পারেন — ফোন কল বা খাতার হিসাব ছাড়াই।")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {problems.map((p) => (
            <div key={p.e} className="card space-y-1">
              <div className="text-2xl">{p.e}</div>
              <div className="text-sm font-semibold" style={{ color: "#475569" }}>❌ {bn ? p.pBn : p.pEn}</div>
              <div className="text-sm font-semibold" style={{ color: "#155e75" }}>✅ {bn ? p.sBn : p.sEn}</div>
            </div>
          ))}
        </div>
        <p className="muted text-sm">
          {t("Delivery is closed in two safe steps: you confirm you received the jar, then the vendor confirms payment and completes the order.",
            "ডেলিভারি দুই ধাপে নিরাপদে শেষ হয়: আপনি জার পাওয়ার কথা নিশ্চিত করেন, তারপর ভেন্ডর পেমেন্ট নিশ্চিত করে অর্ডার সম্পন্ন করে।")}
        </p>
      </section>

      {/* Companies */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t("Water companies on Filter Wala", "Filter Wala-তে থাকা পানির কোম্পানি")}</h2>
        {active.length === 0 && <p className="muted text-sm">{t("Companies will appear here soon.", "শীঘ্রই কোম্পানির তালিকা আসছে।")}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {active.map((c) => {
            const [lo, hi] = feeRange(c.bands);
            return (
              <div key={c.id} className="card space-y-3">
                <div className="flex items-center justify-between">
                  <b className="text-lg">{c.name}</b>
                  <span className="chip chip-aqua">{t("Open", "চালু")}</span>
                </div>
                <div className="muted text-sm">📍 {c.areas.join(", ") || "—"}</div>
                <div className="divide-y rounded-lg border" style={{ borderColor: "#bae6fd" }}>
                  {ITEMS.map((i) => (
                    <div key={i.key} className="flex justify-between px-3 py-2 text-sm">
                      <span>{bn ? i.bn : i.en}</span>
                      <b style={{ color: "#1d4ed8" }}>৳{c.prices[i.key]}</b>
                    </div>
                  ))}
                </div>
                <div className="panel text-xs">
                  {t(`Floor charge: ৳${lo} – ৳${hi} per item, depending on your floor`,
                    `ফ্লোর চার্জ: তলা অনুযায়ী প্রতি আইটেম ৳${lo} – ৳${hi}`)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="chip chip-gray">{t("Cash", "ক্যাশ")}</span>
                  {c.bkash && <span className="chip chip-blue">bKash</span>}
                  {c.nagad && <span className="chip chip-blue">Nagad</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Login / Register */}
      <section className="card space-y-3 text-center">
        <h2 className="text-lg font-bold">{t("Ready to get started?", "শুরু করতে প্রস্তুত?")}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {ready && user ? (
            <Link href={dashboardPath(user.role)} className="btn">{t("Go to my dashboard", "আমার ড্যাশবোর্ডে যান")}</Link>
          ) : (
            <>
              <Link href="/login" className="btn" style={{ padding: "12px 28px" }}>{t("Login", "লগইন")}</Link>
              <Link href="/register" className="btn-outline" style={{ padding: "12px 28px" }}>{t("Register", "রেজিস্টার")}</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}