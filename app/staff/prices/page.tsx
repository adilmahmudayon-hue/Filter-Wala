"use client";
import Guard from "@/components/Guard";
import PriceEditor from "@/components/PriceEditor";
import { useStore } from "@/components/Store";
import { useLang } from "@/components/Lang";
import { Back } from "@/components/UI";

function Inner() {
  const { user, companies } = useStore();
  const { t } = useLang();
  const company = companies.find((c) => c.id === user!.companyId)!;
  return (
    <div className="space-y-4">
      <Back href="/staff" />
      <h1 className="text-xl font-bold">💰 {company.name} — {t("Price details", "দামের তথ্য")}</h1>
      <PriceEditor companyId={company.id} payment />
    </div>
  );
}

export default function StaffPrices() {
  return <Guard role="staff"><Inner /></Guard>;
}