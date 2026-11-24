"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Order, Company, User, Status, DEFAULT_BANDS, INITIAL_COMPANIES, INITIAL_USERS,
} from "@/lib/data";

type State = { orders: Order[]; companies: Company[]; users: User[]; sessionId: string | null };

type Store = {
  ready: boolean;
  user: User | null;
  orders: Order[];
  companies: Company[];
  users: User[];
  login: (email: string, password: string) => string | null;
  logout: () => void;
  register: (u: Omit<User, "id" | "role" | "suspended">) => string | null;
  addUser: (u: Omit<User, "id">) => string | null;
  updateUser: (id: string, p: Partial<User>) => void;
  changePassword: (id: string, oldPw: string, newPw: string) => string | null;
  addCompany: (name: string) => void;
  updateCompany: (id: string, p: Partial<Company>) => void;
  addOrder: (o: Omit<Order, "id" | "status" | "createdAt">) => void;
  sendEta: (id: string, eta: string) => void;
  markReceived: (id: string) => void;
  complete: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => useContext(Ctx)!;

const KEY = "fw-demo-v2";
const now = () => new Date().toISOString();

const initial: State = {
  companies: INITIAL_COMPANIES,
  users: INITIAL_USERS,
  sessionId: null,
  orders: [
    {
      id: "FW-1001", companyId: "c1", customerId: "x1", customer: "Tanvir Ahmed", phone: "01755555555",
      building: "Hostel B, Room 4B", floor: 4, item: "20L Jar Refill", qty: 2, total: 170,
      slot: "ASAP", pay: "COD", status: "Pending", createdAt: now(),
    },
    {
      id: "FW-1002", companyId: "c1", customerId: "x2", customer: "Nusrat Jahan", phone: "01866666666",
      building: "Mess 7, Road 3", floor: 1, item: "New Jar + Water (with deposit)", qty: 1, total: 395,
      slot: "Evening 6 PM – 9 PM", pay: "bKash", trxId: "9K3L2M1X", status: "Pending", createdAt: now(),
    },
  ],
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }, [s, ready]);

  const user = s.users.find((u) => u.id === s.sessionId) ?? null;
  const patchOrder = (id: string, p: Partial<Order>) =>
    setS((x) => ({ ...x, orders: x.orders.map((o) => (o.id === id ? { ...o, ...p } : o)) }));

  const emailTaken = (email: string) =>
    s.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  const value: Store = {
    ready, user, orders: s.orders, companies: s.companies, users: s.users,

    login: (email, password) => {
      const u = s.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
      if (!u) return "Wrong email or password.";
      if (u.suspended) return "This account is suspended. Contact support.";
      setS((x) => ({ ...x, sessionId: u.id }));
      return null;
    },
    logout: () => setS((x) => ({ ...x, sessionId: null })),

    register: (u) => {
      if (emailTaken(u.email)) return "That email is already registered.";
      const id = `u-${Date.now()}`;
      setS((x) => ({ ...x, users: [...x.users, { ...u, id, role: "student" }], sessionId: id }));
      return null;
    },
    addUser: (u) => {
      if (emailTaken(u.email)) return "That email is already registered.";
      setS((x) => ({ ...x, users: [...x.users, { ...u, id: `u-${Date.now()}` }] }));
      return null;
    },
    updateUser: (id, p) =>
      setS((x) => ({ ...x, users: x.users.map((u) => (u.id === id ? { ...u, ...p } : u)) })),
    changePassword: (id, oldPw, newPw) => {
      const u = s.users.find((x) => x.id === id);
      if (!u || u.password !== oldPw) return "Current password is incorrect.";
      if (newPw.length < 6) return "New password must be at least 6 characters.";
      setS((x) => ({ ...x, users: x.users.map((y) => (y.id === id ? { ...y, password: newPw } : y)) }));
      return null;
    },

    addCompany: (name) =>
      setS((x) => ({
        ...x,
        companies: [...x.companies, {
          id: `c${Date.now()}`, name, phone: "", bkash: "", nagad: "", areas: [], active: true,
          prices: { refill: 35, newJar: 350, filter: 1800 }, bands: DEFAULT_BANDS,
        }],
      })),
    updateCompany: (id, p) =>
      setS((x) => ({ ...x, companies: x.companies.map((c) => (c.id === id ? { ...c, ...p } : c)) })),

    addOrder: (o) =>
      setS((x) => ({
        ...x,
        orders: [{ ...o, id: `FW-${1001 + x.orders.length}`, status: "Pending" as Status, createdAt: now() }, ...x.orders],
      })),
    sendEta: (id, eta) => patchOrder(id, { eta, status: "Scheduled" }),
    markReceived: (id) => patchOrder(id, { status: "Received" }),
    complete: (id) => patchOrder(id, { status: "Completed" }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}