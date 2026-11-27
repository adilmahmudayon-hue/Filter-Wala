"use client";
import { useRouter } from "next/navigation";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { BigTile } from "@/components/UI";

function Inner() {
  const { user, orders, logout } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const open = orders.filter((o) => o.customerId === user!.id && o.status !== "Completed").length;

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h1 className="text-xl font-bold">{t("Hello", "হ্যালো")}, {user!.name} 👋</h1>
        <p className="muted text-sm">{t("What would you like to do?", "আপনি কী করতে চান?")}</p>
      </div>
      <BigTile href="/student/order" emoji="🛒" title={t("Place an order", "অর্ডার করুন")}
        sub={t("Order jars and filters", "জার ও ফিল্টার অর্ডার করুন")} />
      <BigTile href="/student/orders" emoji="📦" title={t("My orders", "আমার অর্ডার")}
        sub={t("Track, reschedule, confirm", "ট্র্যাক, সময় পরিবর্তন, নিশ্চিত করুন")} badge={open || ""} />
      <BigTile href="/profile" emoji="👤" title={t("My profile", "আমার প্রোফাইল")}
        sub={t("Address, floor, password", "ঠিকানা, তলা, পাসওয়ার্ড")} />
      <BigTile dark emoji="🚪" title={t("Logout", "লগআউট")} onClick={() => { logout(); router.push("/"); }} />
    </div>
  );
}

export default function StudentPage() {
  return <Guard role="student"><Inner /></Guard>;
}