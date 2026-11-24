export type ItemKey = "refill" | "newJar" | "filter";
export type PayMethod = "COD" | "bKash" | "Nagad";
export type Status = "Pending" | "Scheduled" | "Received" | "Completed";
export type Role = "student" | "staff" | "admin";

export type Band = { label: string; min: number; max: number; fee: number };

export type Company = {
  id: string; name: string; phone: string; bkash: string; nagad: string;
  areas: string[]; active: boolean; prices: Record<ItemKey, number>; bands: Band[];
};

export type User = {
  id: string; role: Role; name: string; email: string; password: string; phone: string;
  studentId?: string; building?: string; area?: string; floor?: number;
  companyId?: string; suspended?: boolean;
};

export type Order = {
  id: string; companyId: string; customerId: string; customer: string; phone: string;
  building: string; floor: number; item: string; qty: number; total: number;
  slot: string; pay: PayMethod; trxId?: string; status: Status; eta?: string;
  createdAt: string;
};

export const ITEMS: { key: ItemKey; label: string }[] = [
  { key: "refill", label: "20L Jar Refill" },
  { key: "newJar", label: "New Jar + Water (with deposit)" },
  { key: "filter", label: "Water Filter / Dispenser" },
];

export const SLOTS = ["ASAP", "Morning 9 AM – 12 PM", "Afternoon 2 PM – 5 PM", "Evening 6 PM – 9 PM"];

export const DEFAULT_BANDS: Band[] = [
  { label: "Ground Floor", min: 0, max: 0, fee: 40 },
  { label: "1st – 2nd Floor", min: 1, max: 2, fee: 45 },
  { label: "3rd – 4th Floor", min: 3, max: 4, fee: 50 },
  { label: "5th+ Floor", min: 5, max: 99, fee: 60 },
];

export const floorFee = (bands: Band[], f: number) =>
  (bands.find((b) => f >= b.min && f <= b.max) ?? bands[bands.length - 1]).fee;

export const floorLabel = (f: number) => (f === 0 ? "Ground" : `Floor ${f}`);

export const dashboardPath = (r: Role) =>
  r === "student" ? "/student" : r === "staff" ? "/staff" : "/admin";

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "c1", name: "Aqua Fresh", phone: "01711000001", bkash: "01711000001", nagad: "01811000001",
    areas: ["Mirpur", "Kafrul"], active: true, prices: { refill: 35, newJar: 350, filter: 1800 },
    bands: DEFAULT_BANDS,
  },
  {
    id: "c2", name: "Pure Drop BD", phone: "01911000002", bkash: "01911000002", nagad: "01611000002",
    areas: ["Mirpur", "Pallabi"], active: true, prices: { refill: 30, newJar: 320, filter: 1750 },
    bands: DEFAULT_BANDS,
  },
  {
    id: "c3", name: "Blue Spring", phone: "01511000003", bkash: "01511000003", nagad: "01511000004",
    areas: ["Dhanmondi"], active: false, prices: { refill: 40, newJar: 380, filter: 1900 },
    bands: DEFAULT_BANDS,
  },
];

export const INITIAL_USERS: User[] = [
  { id: "u-admin", role: "admin", name: "Platform Admin", email: "admin@filterwala.com", password: "admin123", phone: "01700000001" },
  { id: "u-staff1", role: "staff", name: "Karim (Aqua Fresh)", email: "staff@aqua.com", password: "staff123", phone: "01722222222", companyId: "c1" },
  { id: "u-staff2", role: "staff", name: "Salam (Pure Drop)", email: "staff@pure.com", password: "staff123", phone: "01733333333", companyId: "c2" },
  {
    id: "u-s1", role: "student", name: "Rafiq Hasan", email: "student@mail.com", password: "student123",
    phone: "01700000000", studentId: "2021-1-60-045", building: "Mess 12", area: "Road 5, Mirpur", floor: 3,
  },
];