
"use client";

import Link from "next/link";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { ITEMS, dashboardPath, feeRange } from "@/lib/data";

const features = [
  {
    emoji: "🚰",
    title: "Easy Water Ordering",
    bn: "সহজে পানির অর্ডার",
    description: "Order water jars and filters from available companies in just a few clicks.",
    descriptionBn: "মাত্র কয়েকটি ক্লিকেই পানির জার ও ফিল্টার অর্ডার করুন।",
    color: "#e0f2fe",
  },
  {
    emoji: "📋",
    title: "Smart Order Tracking",
    bn: "স্মার্ট অর্ডার ট্র্যাকিং",
    description: "Keep track of your orders, delivery progress and payment information.",
    descriptionBn: "আপনার অর্ডার, ডেলিভারি এবং পেমেন্টের তথ্য সহজে দেখুন।",
    color: "#ede9fe",
  },
  {
    emoji: "💰",
    title: "Transparent Pricing",
    bn: "স্বচ্ছ মূল্য তালিকা",
    description: "See company prices and floor-based delivery charges before ordering.",
    descriptionBn: "অর্ডারের আগেই কোম্পানির মূল্য ও ফ্লোর অনুযায়ী ডেলিভারি চার্জ দেখুন।",
    color: "#dcfce7",
  },
  {
    emoji: "⏰",
    title: "Convenient Delivery",
    bn: "সুবিধাজনক ডেলিভারি",
    description: "Choose a suitable delivery time and stay informed about your order.",
    descriptionBn: "আপনার সুবিধামতো ডেলিভারির সময় বেছে নিন এবং আপডেট পান।",
    color: "#fef3c7",
  },
];

export default function Home() {
  const { user, ready, companies } = useStore();
  const { t, bn } = useLang();

  const active = companies.filter((c) => c.active);

  return (
    <main className="space-y-12 pb-8 pt-5">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shine {
          from { background-position: 0% 50%; }
          to { background-position: 200% 50%; }
        }

        .hero-float {
          animation: float 4s ease-in-out infinite;
        }

        .fade-up {
          animation: fadeUp 0.7s ease both;
        }

        .feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .feature-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.10);
        }

        .company-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .company-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
        }

        .hero-glow {
          background-size: 200% 200%;
          animation: shine 8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-float, .fade-up, .feature-card, .company-card, .hero-glow {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      {/* Promotional Hero */}
      <section
        className="hero-glow relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-10 sm:py-16"
        style={{
          background:
            "linear-gradient(120deg, #082f49, #075985, #0e7490, #164e63)",
          color: "#ffffff",
        }}
      >
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-300 opacity-10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-blue-300 opacity-10 blur-2xl" />

        <div className="relative z-10">
          <div className="hero-float mb-5 text-6xl">💧</div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
            FILTER WALA • SMART WATER DELIVERY
          </p>

          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
            {t(
              "Fresh Water. Easy Ordering. Right at Your Door.",
              "বিশুদ্ধ পানি। সহজ অর্ডার। পৌঁছে যাবে আপনার দরজায়।"
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-cyan-100 sm:text-base">
            {t(
              "Discover water companies, compare prices and order your water jars conveniently through Filter Wala.",
              "Filter Wala-এর মাধ্যমে পানির কোম্পানি খুঁজুন, দাম তুলনা করুন এবং সহজেই পানির জার অর্ডার করুন।"
            )}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ready && user ? (
              <Link
                href={dashboardPath(user.role)}
                className="rounded-xl bg-white px-7 py-3 font-bold text-sky-900 shadow-lg transition hover:bg-cyan-50"
              >
                {t("Go to Dashboard →", "ড্যাশবোর্ডে যান →")}
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-7 py-3 font-bold text-sky-900 shadow-lg transition hover:bg-cyan-50"
                >
                  {t("Get Started →", "শুরু করুন →")}
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-cyan-100 px-7 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  {t("Login", "লগইন")}
                </Link>
              </>
            )}

            <a
              href="#companies"
              className="rounded-xl border border-cyan-100 px-7 py-3 font-bold text-white transition hover:bg-white/10"
            >
              {t("Explore Companies", "কোম্পানি দেখুন")}
            </a>
          </div>

          <p className="mt-7 text-xs text-cyan-100">
            {t(
              "A smarter way to manage your everyday water needs.",
              "প্রতিদিনের পানির চাহিদা পূরণের আরও স্মার্ট উপায়।"
            )}
          </p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="space-y-5">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">
            WHY FILTER WALA?
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            {t("Everything Made Easier", "আপনার জন্য সবকিছু আরও সহজ")}
          </h2>
          <p className="muted mt-2 text-sm">
            {t(
              "Four useful features for a better water delivery experience.",
              "পানির ডেলিভারি অভিজ্ঞতা আরও ভালো করতে চারটি সুবিধা।"
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="feature-card fade-up rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{ background: feature.color }}
              >
                {feature.emoji}
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {bn ? feature.bn : feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {bn ? feature.descriptionBn : feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Company Advertisements */}
      <section id="companies" className="scroll-mt-24 space-y-5">
        <div className="rounded-2xl bg-slate-900 px-5 py-6 text-white sm:px-7">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
            OUR PARTNERS
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">
            {t("Find Your Water Company", "আপনার পছন্দের পানির কোম্পানি খুঁজুন")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {t(
              "Explore available companies, compare their prices and choose the service that suits you.",
              "কোম্পানিগুলো দেখুন, তাদের দাম তুলনা করুন এবং আপনার পছন্দের সার্ভিস বেছে নিন।"
            )}
          </p>
        </div>

        {active.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <div className="text-4xl">🏢</div>
            <p className="mt-3 font-semibold text-slate-700">
              {t(
                "New company advertisements are coming soon!",
                "নতুন কোম্পানির বিজ্ঞাপন শীঘ্রই আসছে!"
              )}
            </p>
            <p className="muted mt-1 text-sm">
              {t(
                "Available companies will appear here.",
                "সক্রিয় কোম্পানিগুলো এখানে দেখা যাবে।"
              )}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {active.map((c, index) => {
              const [lo, hi] = feeRange(c.bands);

              return (
                <article
                  key={c.id}
                  className="company-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div
                    className="px-5 py-5"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(120deg, #0e7490, #164e63)"
                          : "linear-gradient(120deg, #4338ca, #312e81)",
                      color: "white",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                        💧
                      </div>
                      <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-emerald-950">
                        ● {t("Available", "সক্রিয়")}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-extrabold">
                      {c.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/80">
                      {t("Your water delivery partner", "আপনার পানির ডেলিভারি পার্টনার")}
                    </p>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {t("Delivery Areas", "ডেলিভারি এলাকা")}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        📍 {c.areas.join(", ") || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {t("Product Prices", "পণ্যের মূল্য")}
                      </p>

                      <div className="divide-y rounded-xl border border-slate-100">
                        {ITEMS.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
                          >
                            <span className="text-slate-600">
                              {bn ? item.bn : item.en}
                            </span>
                            <b className="text-sky-800">
                              ৳{c.prices[item.key]}
                            </b>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900">
                      <b>{t("Floor delivery charge", "ফ্লোর ডেলিভারি চার্জ")}</b>
                      <p className="mt-1">
                        ৳{lo} – ৳{hi}{" "}
                        {t("per item, depending on floor", "প্রতি আইটেম, ফ্লোর অনুযায়ী")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="chip chip-gray">
                        {t("Cash", "ক্যাশ")}
                      </span>
                      {c.bkash && <span className="chip chip-blue">bKash</span>}
                      {c.nagad && <span className="chip chip-blue">Nagad</span>}
                    </div>

                    <Link
                      href={ready && user ? dashboardPath(user.role) : "/login"}
                      className="block rounded-xl bg-sky-800 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-sky-900"
                    >
                      {t("Order / Explore →", "অর্ডার করুন / বিস্তারিত দেখুন →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Final Call to Action */}
      <section className="rounded-3xl bg-cyan-50 px-6 py-10 text-center">
        <div className="text-4xl">🚚</div>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
          {t("Ready for a smarter water delivery experience?", "স্মার্ট পানির ডেলিভারি অভিজ্ঞতার জন্য প্রস্তুত?")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          {t(
            "Join Filter Wala and manage your water orders with greater convenience.",
            "Filter Wala-এর সাথে যুক্ত হোন এবং আরও সহজে আপনার পানির অর্ডার পরিচালনা করুন।"
          )}
        </p>

        <div className="mt-6">
          {ready && user ? (
            <Link href={dashboardPath(user.role)} className="btn">
              {t("Go to Dashboard", "ড্যাশবোর্ডে যান")}
            </Link>
          ) : (
            <Link href="/register" className="btn">
              {t("Create Your Account", "অ্যাকাউন্ট তৈরি করুন")}
            </Link>
          )}
        </div>
      </section>

      {/* Developer Footer */}
      <footer className="overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 text-white">
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold text-cyan-300">
              💧 Filter Wala
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              {t(
                "Making water jar and filter delivery easier, smarter and more convenient.",
                "পানির জার ও ফিল্টার ডেলিভারিকে আরও সহজ, স্মার্ট ও সুবিধাজনক করে তোলা।"
              )}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-cyan-300">
              {t("Creator & Developer", "নির্মাতা ও ডেভেলপার")}
            </h3>
            <p className="mt-2 text-lg font-bold">Adil Mahmud Ayon</p>
            <p className="mt-1 text-sm text-slate-300">
              {t(
                "Creator • Designer • Web Developer",
                "নির্মাতা • ডিজাইনার • ওয়েব ডেভেলপার"
              )}
            </p>
            <p className="mt-1 text-sm text-slate-300">KUET — CSE '25</p>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                📞{" "}
                <a
                  href="tel:01862695696"
                  className="text-cyan-200 hover:underline"
                >
                  018 626 95696
                </a>
              </p>
              <p>
                ✉️{" "}
                <a
                  href="mailto:adilmahmudayon@gmail.com"
                  className="break-all text-cyan-200 hover:underline"
                >
                  adilmahmudayon@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-slate-700 pt-5 text-center text-xs text-slate-400">
          © 2026 Filter Wala.{" "}
          {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}
          <p className="mt-2">
            {t("Designed & Developed by", "ডিজাইন ও ডেভেলপ করেছেন")}{" "}
            <span className="font-semibold text-cyan-300">
              Adil Mahmud Ayon
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
}
