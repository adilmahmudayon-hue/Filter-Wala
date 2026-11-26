"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Role } from "@/lib/data";

export default function Guard({ role, children }: { role?: Role; children: ReactNode }) {
  const { user, ready } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const allowed = !!user && (!role || user.role === role);

  useEffect(() => {
    if (ready && !allowed) router.replace("/login");
  }, [ready, allowed, router]);

  if (!ready || !allowed) return <p className="muted">{t("Loading…", "লোড হচ্ছে…")}</p>;
  return <>{children}</>;
}