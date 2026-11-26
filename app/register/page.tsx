
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Field, FloorSelect } from "@/components/UI";

export default function RegisterPage() {
  const { register } = useStore();
  const { t, err } = useLang();
  const router = useRouter();

  const [f, setF] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    studentId: "",
    building: "",
    area: "",
    floor: 0,
  });

  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string | number) =>
    setF((x) => ({ ...x, [k]: v }));

  const submit = async () => {
    if (loading) return;

    setError("");

    if (
      !f.name.trim() ||
      !f.phone.trim() ||
      !f.email.trim() ||
      !f.studentId.trim() ||
      !f.building.trim() ||
      !f.area.trim()
    ) {
      return setError(
        t(
          "Please fill in all fields.",
          "অনুগ্রহ করে সব ঘর পূরণ করুন।"
        )
      );
    }

    if (f.password.length < 6) {
      return setError(
        t(
          "Password must be at least 6 characters.",
          "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
        )
      );
    }

    setLoading(true);

    try {
      const e = await register({
        name: f.name.trim(),
        phone: f.phone.trim(),
        email: f.email.trim(),
        password: f.password,
        studentId: f.studentId.trim(),
        building: f.building.trim(),
        area: f.area.trim(),
        floor: f.floor,
      });

      if (e === "email_confirmation_required") {
        setDone(
          t(
            "Registration successful! Please check your email and confirm your account before logging in.",
            "রেজিস্ট্রেশন সফল হয়েছে! লগইন করার আগে আপনার ইমেইলে গিয়ে অ্যাকাউন্টটি নিশ্চিত করুন।"
          )
        );
        return;
      }

      if (e) {
        setError(err(e));
        return;
      }

      router.push("/student");
    } catch {
      setError(
        t(
          "Something went wrong. Please try again.",
          "সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-3 pt-4">
        <section className="card space-y-3 text-center">
          <div className="text-4xl">✅</div>
          <p className="font-medium">{done}</p>
          <Link href="/login" className="btn">
            {t("Go to login", "লগইনে যান")}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md pt-4">
      <section className="card space-y-4">
        <div>
          <h1 className="text-xl font-bold">
            🎓 {t("Student Registration", "শিক্ষার্থী রেজিস্ট্রেশন")}
          </h1>
          <p className="muted mt-1 text-sm">
            {t(
              "Create your Filter Wala student account.",
              "আপনার Filter Wala শিক্ষার্থী অ্যাকাউন্ট তৈরি করুন।"
            )}
          </p>
        </div>

        <Field
          label={t("Full name", "পূর্ণ নাম")}
          value={f.name}
          onChange={(v) => set("name", v)}
        />

        <Field
          label={t("Phone number", "ফোন নম্বর")}
          type="tel"
          value={f.phone}
          onChange={(v) => set("phone", v)}
        />

        <Field
          label={t("Email", "ইমেইল")}
          type="email"
          value={f.email}
          onChange={(v) => set("email", v)}
        />

        <Field
          label={t("Student ID", "স্টুডেন্ট আইডি")}
          value={f.studentId}
          onChange={(v) => set("studentId", v)}
        />

        <Field
          label={t("Building name / House no.", "বিল্ডিংয়ের নাম / বাড়ি নম্বর")}
          value={f.building}
          onChange={(v) => set("building", v)}
        />

        <Field
          label={t("Street / Area", "রাস্তা / এলাকা")}
          value={f.area}
          onChange={(v) => set("area", v)}
        />

        <label className="block text-sm font-medium">
          {t("Floor", "তলা")}
          <div className="mt-1">
            <FloorSelect
              value={f.floor}
              onChange={(v) => set("floor", v)}
            />
          </div>
        </label>

        <Field
          label={t("Password", "পাসওয়ার্ড")}
          type="password"
          value={f.password}
          onChange={(v) => set("password", v)}
        />

        {error && (
          <p
            className="text-sm font-medium"
            style={{ color: "#b91c1c" }}
          >
            {error}
          </p>
        )}

        <button
          className="btn w-full"
          onClick={submit}
          disabled={loading}
        >
          {loading
            ? t("Creating account...", "অ্যাকাউন্ট তৈরি হচ্ছে...")
            : t("Create student account", "শিক্ষার্থী অ্যাকাউন্ট তৈরি করুন")}
        </button>

        <p className="muted text-center text-sm">
          {t("Already registered?", "আগেই রেজিস্টার করেছেন?")}{" "}
          <Link
            href="/login"
            style={{ color: "#1d4ed8", fontWeight: 600 }}
          >
            {t("Login", "লগইন")}
          </Link>
        </p>
      </section>
    </div>
  );
}
