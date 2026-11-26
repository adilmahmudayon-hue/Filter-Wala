"use client";
import { useRouter } from "next/navigation";
import Guard from "@/components/Guard";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { BigTile } from "@/components/UI";

function Inner() {
  const { users, companies, logout } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const waiting = users.filter((u) => u.role === "staff" && u.pending).length;

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-xl font-bold">{t("Admin Panel", "অ্যাডমিন প্যানেল")}</h1>
      <BigTile href="/admin/companies" emoji="🏢" title={t("Companies", "কোম্পানি")} badge={companies.length}
        sub={t("Add, activate, prices", "যোগ, সক্রিয়/নিষ্ক্রিয়, দাম")} />
      <BigTile href="/admin/staffs" emoji="🚴" title={t("Staffs", "স্টাফ")}
        badge={waiting ? `${waiting} ${t("to approve", "অনুমোদন বাকি")}` : users.filter((u) => u.role === "staff").length}
        sub={t("Accounts and approvals", "অ্যাকাউন্ট ও অনুমোদন")} />
      <BigTile href="/admin/students" emoji="🎓" title={t("Students", "শিক্ষার্থী")}
        badge={users.filter((u) => u.role === "student").length} sub={t("Accounts and addresses", "অ্যাকাউন্ট ও ঠিকানা")} />
      <BigTile href="/profile" emoji="👤" title={t("Profile", "প্রোফাইল")} sub={t("Info and password", "তথ্য ও পাসওয়ার্ড")} />
      <BigTile dark emoji="🚪" title={t("Logout", "লগআউট")} onClick={() => { logout(); router.push("/"); }} />
    </div>
  );
}

export default function AdminPage() {
  return <Guard role="admin"><Inner /></Guard>;
}