"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/Store";
import { dashboardPath } from "@/lib/data";

export default function Nav() {
  const { user, logout, ready } = useStore();
  const router = useRouter();

  return (
    <header style={{ background: "#0b1220" }} className="sticky top-0 z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" style={{ color: "#22d3ee" }} className="text-lg font-bold">💧 Filter Wala</Link>
        <nav className="flex items-center gap-4 text-sm font-medium" style={{ color: "#fff" }}>
          {ready && user ? (
            <>
              <Link href={dashboardPath(user.role)}>Dashboard</Link>
              {user.role === "staff" && <Link href="/staff/prices">Prices</Link>}
              <Link href="/profile">Profile</Link>
              <button onClick={() => { logout(); router.push("/"); }}
                style={{ color: "#22d3ee", fontWeight: 600, cursor: "pointer" }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register" style={{ color: "#22d3ee" }}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}