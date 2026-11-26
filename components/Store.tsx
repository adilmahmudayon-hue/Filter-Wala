"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Order, Company, User, Status, Role, SlotKey, DEFAULT_BANDS, INITIAL_COMPANIES, INITIAL_USERS,
} from "@/lib/data";

type State = { orders: Order[]; companies: Company[]; users: User[]; sessionId: string | null };

type Store = {
  ready: boolean;
  user: User | null;
  orders: Order[];
  companies: Company[];
  users: User[];
  login: (email: string, password: string, role: Role) => string | null;
  logout: () => void;
  register: (u: Omit<User, "id" | "role">) => string | null; // student, logs in
  signup: (u: Omit<User, "id">) => string | null; // any role, no login
  updateUser: (id: string, p: Partial<User>) => void;
  removeUser: (id: string) => void;
  changePassword: (id: string, oldPw: string, newPw: string) => string | null;
  addCompany: (name: string, phone: string, areas: string[]) => void;
  updateCompany: (id: string, p: Partial<Company>) => void;
  addOrder: (o: Omit<Order, "id" | "status" | "createdAt">) => void;
  sendEta: (id: string, eta: string) => void;
  markReceived: (id: string) => void;
  reschedule: (id: string, slot: SlotKey) => void;
  complete: (id: string, byUserId: string) => void;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => useContext(Ctx)!;

const KEY = "fw-demo-v3";
const now = () => new Date().toISOString();

const initial: State = {
  companies: INITIAL_COMPANIES,
  users: INITIAL_USERS,
  sessionId: null,
  orders: [
    {
      id: "FW-1001", companyId: "c1", customerId: "x1", customer: "Tanvir Ahmed", phone: "01755555555",
      building: "Hostel B, Room 4B", floor: 4, item: "newJar", qty: 1, total: 400,
      slot: "asap", pay: "COD", status: "Pending", createdAt: now(),
    },
    {
      id: "FW-1002", companyId: "c1", customerId: "x2", customer: "Nusrat Jahan", phone: "01866666666",
      building: "Mess 7, Road 3", floor: 1, item: "filter", qty: 1, total: 1845,
      slot: "evening", pay: "bKash", trxId: "9K3L2M1X", senderPhone: "01866666666",
      status: "Pending", createdAt: now(),
    },
    {
      id: "FW-1003", companyId: "c1", customerId: "u-s1", customer: "Rafiq Hasan", phone: "01700000000",
      building: "Mess 12, Road 5, Mirpur", floor: 3, item: "newJar", qty: 1, total: 400,
      slot: "morning", pay: "COD", status: "Completed", completedBy: "u-staff1",
      completedAt: now(), createdAt: now(),
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

    login: (email, password, role) => {
      const u = s.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
      if (!u) return "login_wrong";
      if (u.role !== role) return "role_mismatch";
      if (u.pending) return "pending";
      if (u.suspended) return "suspended";
      setS((x) => ({ ...x, sessionId: u.id }));
      return null;
    },
    logout: () => setS((x) => ({ ...x, sessionId: null })),

    register: (u) => {
      if (emailTaken(u.email)) return "email_taken";
      const id = `u-${Date.now()}`;
      setS((x) => ({ ...x, users: [...x.users, { ...u, id, role: "student" }], sessionId: id }));
      return null;
    },
    signup: (u) => {
      if (emailTaken(u.email)) return "email_taken";
      setS((x) => ({ ...x, users: [...x.users, { ...u, id: `u-${Date.now()}` }] }));
      return null;
    },
    updateUser: (id, p) =>
      setS((x) => ({ ...x, users: x.users.map((u) => (u.id === id ? { ...u, ...p } : u)) })),
    removeUser: (id) => setS((x) => ({ ...x, users: x.users.filter((u) => u.id !== id) })),
    changePassword: (id, oldPw, newPw) => {
      const u = s.users.find((x) => x.id === id);
      if (!u || u.password !== oldPw) return "pw_wrong";
      if (newPw.length < 6) return "pw_short";
      setS((x) => ({ ...x, users: x.users.map((y) => (y.id === id ? { ...y, password: newPw } : y)) }));
      return null;
    },

    addCompany: (name, phone, areas) =>
      setS((x) => ({
        ...x,
        companies: [...x.companies, {
          id: `c${Date.now()}`, name, phone, bkash: "", nagad: "", areas, active: true,
          prices: { newJar: 350, filterJar: 2150, filter: 1800 }, bands: DEFAULT_BANDS,
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
    reschedule: (id, slot) => patchOrder(id, { slot, rescheduled: true }),
    complete: (id, byUserId) => patchOrder(id, { status: "Completed", completedBy: byUserId, completedAt: now() }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}