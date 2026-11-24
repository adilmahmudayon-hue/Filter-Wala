"use client";
import Link from "next/link";
import { useStore } from "@/components/Store";
import { dashboardPath } from "@/lib/data";

const steps = [
  { emoji: "🏢", title: "Pick a vendor", desc: "Compare water companies serving your area." },
  { emoji: "🧮", title: "Auto floor pricing", desc: "Your floor charge is added automatically. No haggling." },
  { emoji: "💳", title: "Pay your way", desc: "Cash on delivery, bKash or Nagad." },
  { emoji: "🕒", title: "Track delivery", desc: "Get the arrival time and confirm when the jar arrives." },
];

export default function Home() {
  const { user, ready } = useStore();

  return (
    <div className="space-y-8 pt-4">
      <section className="rounded-2xl p-8 text-center" style={{ background: "#0b1220", color: "#fff" }}>
        <div className="text-5xl">💧</div>
        <h1 className="mt-2 text-3xl font-bold">Filter Wala</h1>
        <p className="mt-2" style={{ color: "#a5f3fc" }}>
          Water jars & filters delivered to your mess, hostel or flat.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {ready && user ? (
            <Link href={dashboardPath(user.role)} className="btn">Go to my dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn">Login</Link>
              <Link href="/register" className="btn-outline">Register as Student</Link>
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">How it works</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.title} className="card">
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <div className="muted text-sm">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel text-sm">
        <b>Water company staff or admin?</b> Use the same Login page. You'll be taken to your own dashboard automatically.
      </section>
    </div>
  );
}