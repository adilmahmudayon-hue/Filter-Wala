"use client";
import { useRouter } from "next/navigation";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { BigTile } from "@/components/UI";

function Inner() {
  const { user, orders, companies, logout } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const company = companies.find((c) => c.id === user!.companyId);
  const pending = orders.filter((o) => o.companyId === user!.companyId && o.status !== "Completed").length;

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h1 className="text-xl font-bold">{company?.name}</h1>
        <p className="muted text-sm">{t("Staff dashboard", "স্টাফ ড্যাশবোর্ড")} · {user!.name}</p>
      </div>
      <BigTile href="/staff/orders" emoji="📋" title={t("Order dashboard", "অর্ডার ড্যাশবোর্ড")}
        sub={t("Pending and completed orders", "অপেক্ষমাণ ও সম্পন্ন অর্ডার")} badge={pending ? `${pending} ${t("pending", "অপেক্ষমাণ")}` : ""} />
      <BigTile href="/staff/prices" emoji="💰" title={t("Price details", "দামের তথ্য")}
        sub={t("View and edit your prices", "আপনার দাম দেখুন ও পরিবর্তন করুন")} />
      <BigTile href="/profile" emoji="👤" title={t("Profile", "প্রোফাইল")} sub={t("Info and password", "তথ্য ও পাসওয়ার্ড")} />
      <BigTile dark emoji="🚪" title={t("Logout", "লগআউট")} onClick={() => { logout(); router.push("/"); }} />
    </div>
  );
}

export default function StaffPage() {
  return <Guard role="staff"><Inner /></Guard>;
}