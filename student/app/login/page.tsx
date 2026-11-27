
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";

import { ROLE_INFO, Role, dashboardPath } from "@/lib/data";

type LoginMethod = "password" | "otp";

export default function LoginPage() {
  const { login, requestOtp, verifyOtp } = useStore();
  const { t, bn, err } = useLang();
  const router = useRouter();

  const role: Role = "student";
  const [method, setMethod] = useState<LoginMethod>("password");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const submitPassword = async () => {
    if (!role) return;

    setError("");
    setMessage("");

    if (!identifier.trim() || !password) {
      setError(t("Enter your email and password.", "ইমেইল ও পাসওয়ার্ড দিন।"));
      return;
    }

    setBusy(true);

    try {
      const result = await login(identifier, password, role);

      if (result) {
        setError(err(result));
        return;
      }

      router.push(dashboardPath(role));
    } catch (e) {
      console.error("Password login error:", e);
      setError(t("Login failed. Please try again.", "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"));
    } finally {
      setBusy(false);
    }
  };

  const sendOtp = async () => {
    if (!role) return;

    setError("");
    setMessage("");
    setOtp("");

    if (!identifier.trim()) {
      setError(t("Enter your email or phone number.", "ইমেইল অথবা ফোন নম্বর দিন।"));
      return;
    }

    if (role !== "student" && identifier.includes("@")) {
      setError(t("Staff and admin must use their phone number for OTP.", "স্টাফ ও অ্যাডমিনকে OTP-এর জন্য ফোন নম্বর ব্যবহার করতে হবে।"));
      return;
    }

    setBusy(true);

    try {
      const result = await requestOtp(identifier, role);

      if (result) {
        setError(err(result));
        return;
      }

      setOtpSent(true);
      setMessage(
        identifier.includes("@")
          ? t("A verification code has been sent to your email.", "আপনার ইমেইলে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।")
          : t("A verification code has been sent to your phone.", "আপনার ফোনে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।")
      );
    } catch (e) {
      console.error("OTP request error:", e);
      setError(t("Could not send OTP. Please try again.", "OTP পাঠানো যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setBusy(false);
    }
  };

  const submitOtp = async () => {
    if (!role) return;

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError(t("Enter the verification code.", "ভেরিফিকেশন কোড দিন।"));
      return;
    }

    setBusy(true);

    try {
      const result = await verifyOtp(identifier, otp, role);

      if (result) {
        setError(err(result));
        return;
      }

      router.push(dashboardPath(role));
    } catch (e) {
      console.error("OTP verification error:", e);
      setError(t("OTP verification failed. Please try again.", "OTP যাচাই করা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setBusy(false);
    }
  };

 

  const info = ROLE_INFO[role];
  const isStudent = role === "student";
  const isEmail = identifier.includes("@");

  return (
    <div className="mx-auto max-w-md space-y-4 pt-4">
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {info.emoji} {t("Login", "লগইন")} — {bn ? info.bn : info.en}
          </h1>

         
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={method === "password" ? "btn" : "btn-outline"}
            onClick={() => {
              setMethod("password");
              setOtpSent(false);
              setOtp("");
              setError("");
              setMessage("");
            }}
          >
            {t("Password", "পাসওয়ার্ড")}
          </button>

          <button
            type="button"
            className={method === "otp" ? "btn" : "btn-outline"}
            onClick={() => {
              setMethod("otp");
              setOtpSent(false);
              setOtp("");
              setError("");
              setMessage("");
            }}
          >
            {t("OTP Code", "OTP কোড")}
          </button>
        </div>

        <label className="block text-sm font-medium">
          {method === "password"
            ? t("Registered email", "রেজিস্টার্ড ইমেইল")
            : isStudent
              ? t("Email or phone number", "ইমেইল অথবা ফোন নম্বর")
              : t("Registered phone number", "রেজিস্টার্ড ফোন নম্বর")}

          <input
            className="input mt-1"
            type="text"
            value={identifier}
            disabled={otpSent}
            placeholder={
              method === "password"
                ? "name@example.com"
                : isStudent
                  ? "name@example.com or +8801XXXXXXXXX"
                  : "+8801XXXXXXXXX"
            }
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
              setMessage("");
            }}
            autoComplete="username"
          />
        </label>

        {method === "password" && (
          <>
            <label className="block text-sm font-medium">
              {t("Password", "পাসওয়ার্ড")}

              <input
                className="input mt-1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitPassword();
                }}
                autoComplete="current-password"
              />
            </label>

            <button
              type="button"
              className="btn w-full"
              disabled={busy}
              onClick={() => void submitPassword()}
            >
              {busy
                ? t("Please wait...", "অপেক্ষা করুন...")
                : t("Login with password", "পাসওয়ার্ড দিয়ে লগইন")}
            </button>
          </>
        )}

        {method === "otp" && (
          <>
            {isStudent && (
              <p className="muted text-xs">
                {t(
                  "Students can receive OTP by email or phone. For phone OTP, use international format such as +8801XXXXXXXXX.",
                  "শিক্ষার্থীরা ইমেইল অথবা ফোনে OTP পেতে পারেন। ফোনের ক্ষেত্রে +8801XXXXXXXXX ফরম্যাট ব্যবহার করুন।"
                )}
              </p>
            )}

            {!isStudent && (
              <p className="muted text-xs">
                {t(
                  "Staff and admin OTP is sent to their registered phone number. Use international format, e.g. +8801XXXXXXXXX.",
                  "স্টাফ ও অ্যাডমিনের OTP রেজিস্টার্ড ফোন নম্বরে পাঠানো হবে। যেমন: +8801XXXXXXXXX"
                )}
              </p>
            )}

            {!otpSent ? (
              <button
                type="button"
                className="btn w-full"
                disabled={busy}
                onClick={() => void sendOtp()}
              >
                {busy
                  ? t("Sending code...", "কোড পাঠানো হচ্ছে...")
                  : t("Send OTP", "OTP পাঠান")}
              </button>
            ) : (
              <>
                <label className="block text-sm font-medium">
                  {t("Verification code", "ভেরিফিকেশন কোড")}

                  <input
                    className="input mt-1"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={10}
                    value={otp}
                    placeholder={t("Enter your OTP", "OTP লিখুন")}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void submitOtp();
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="btn w-full"
                  disabled={busy}
                  onClick={() => void submitOtp()}
                >
                  {busy
                    ? t("Verifying...", "যাচাই করা হচ্ছে...")
                    : t("Verify OTP and login", "OTP যাচাই করে লগইন")}
                </button>

                <button
                  type="button"
                  className="btn-outline w-full"
                  disabled={busy}
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                >
                  {t("Change email or phone", "ইমেইল বা ফোন পরিবর্তন")}
                </button>

                <button
                  type="button"
                  className="text-sm font-medium"
                  style={{ color: "#1d4ed8" }}
                  disabled={busy}
                  onClick={() => void sendOtp()}
                >
                  {t("Resend OTP", "আবার OTP পাঠান")}
                </button>
              </>
            )}
          </>
        )}

        {error && (
          <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm font-medium" style={{ color: "#15803d" }}>
            {message}
          </p>
        )}

        <p className="muted text-sm">
          {t("No account?", "অ্যাকাউন্ট নেই?")}{" "}
          <Link
            href="/register"
            style={{ color: "#1d4ed8", fontWeight: 600 }}
          >
            {t("Register", "রেজিস্টার করুন")}
          </Link>
        </p>
      </section>
    </div>
  );
}
