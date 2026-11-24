"use client";
import Link from "next/link";
import Guard from "@/components/Guard";
import PriceEditor from "@/components/PriceEditor";
import { useStore } from "@/components/Store";

function Inner() {
  const { user, companies } = useStore();
  const company = companies.find((c) => c.id === user!.companyId)!;
  return (
    <div className="space-y-4">
      <Link href="/staff" className="text-sm font-medium" style={{ color: "#1d4ed8" }}>← Back to orders</Link>
      <h1 className="text-xl font-bold">{company.name} — Price List</h1>
      <PriceEditor companyId={company.id} />
    </div>
  );
}

export default function StaffPrices() {
  return <Guard role="staff"><Inner /></Guard>;
}